import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
  Check,
  Eye,
  EyeOff,
  Download,
  Trash2,
  KeyRound,
  Sparkles,
  Sliders,
  Layers,
  ZoomIn,
  ZoomOut,
  ArrowLeft,
  ArrowRight,
  X,
  Plus,
  Sun,
  Moon,
  ShieldCheck,
  Clock,
  FolderArchive,
  Palette,
  AlertTriangle,
  Move,
  LogOut,
  Maximize2,
  Minimize2,
  Smartphone,
  Monitor,
  Share2,
  Crop,
  CheckCircle2,
  FileArchive,
  RefreshCw
} from "lucide-react";
import {
  CreativeFormat,
  CreativeItem,
  AdaptationMode,
  PositionAnchor,
  BackgroundSetting,
  WatermarkSetting,
  BadgeSetting,
  OutputFormat,
  ZipStructure,
  PlatformCategory,
  FormatOverride,
  EffectiveConfig,
  SafeZoneType,
} from "./types";
import {
  STANDARD_FORMATS,
  BRAND_COLORS,
  THUMB_H,
  clamp,
  makeCanvas,
  makeProxy,
  detectAlpha,
  edgeColor,
  detectSaliency,
  layoutFor,
  flagsFor,
  renderInto,
  renderFull,
  encode,
  sanitizeBase,
  generateFileName,
  buildZip,
} from "./engine";

const LS_SETTINGS_KEY = "justresize_settings_v2";
const LS_AUTH_KEY = "js_resizer_auth";
const LS_TOKEN_KEY = "js_resizer_token";
const LS_CUSTOM_FORMATS = "justresize_custom_formats_v2";

export default function App() {
  // ------------------ AUTH STATE ------------------
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem(LS_AUTH_KEY) === "true";
  });
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // ------------------ THEME & GENERAL ------------------
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem("justresize_theme");
    return saved ? saved === "dark" : true;
  });

  useEffect(() => {
    localStorage.setItem("justresize_theme", isDark ? "dark" : "light");
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  // ------------------ FORMATS & PRESETS ------------------
  const [customFormats, setCustomFormats] = useState<CreativeFormat[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(LS_CUSTOM_FORMATS) || "[]");
    } catch {
      return [];
    }
  });

  const allFormats = useMemo(() => {
    return [...STANDARD_FORMATS, ...customFormats];
  }, [customFormats]);

  const [selectedPlatform, setSelectedPlatform] = useState<PlatformCategory>("all");
  const [selectedFormatIds, setSelectedFormatIds] = useState<string[]>(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(LS_SETTINGS_KEY) || "{}");
      if (Array.isArray(saved.formats) && saved.formats.length > 0) return saved.formats;
    } catch {}
    return ["1x1", "4x5", "9x16", "191x1"]; // Default to Meta Ads Pack
  });

  const selectedFormats = useMemo(() => {
    return allFormats.filter((f) => selectedFormatIds.includes(f.id));
  }, [allFormats, selectedFormatIds]);

  const filteredFormats = useMemo(() => {
    if (selectedPlatform === "all") return allFormats;
    return allFormats.filter((f) => f.platform === selectedPlatform);
  }, [allFormats, selectedPlatform]);

  // ------------------ SETTINGS ------------------
  const [mode, setMode] = useState<AdaptationMode>(() => {
    try {
      return JSON.parse(localStorage.getItem(LS_SETTINGS_KEY) || "{}").mode || "fit";
    } catch {
      return "fit";
    }
  });

  const [pos, setPos] = useState<PositionAnchor>(() => {
    try {
      return JSON.parse(localStorage.getItem(LS_SETTINGS_KEY) || "{}").pos || { x: 0.5, y: 0.5 };
    } catch {
      return { x: 0.5, y: 0.5 };
    }
  });

  const [bg, setBg] = useState<BackgroundSetting>(() => {
    try {
      return (
        JSON.parse(localStorage.getItem(LS_SETTINGS_KEY) || "{}").bg || {
          kind: "extend",
          color: "#FFFFFF",
          blurRadius: 35,
          blurDim: 0.25,
        }
      );
    } catch {
      return { kind: "extend", color: "#FFFFFF", blurRadius: 35, blurDim: 0.25 };
    }
  });

  const [watermark, setWatermark] = useState<WatermarkSetting>({
    enabled: false,
    type: "white",
    position: "top-right",
    scale: 0.2,
    opacity: 0.85,
  });

  const [badge, setBadge] = useState<BadgeSetting>({
    enabled: false,
    text: "🔥 Безкоштовний урок",
    position: "top-left",
    theme: "emerald",
  });

  const [output, setOutput] = useState<OutputFormat>("original");
  const [quality, setQuality] = useState<number>(92);
  const [nameMode, setNameMode] = useState<boolean>(false);
  const [zipStructure, setZipStructure] = useState<ZipStructure>("flat");
  const [retinaGDN, setRetinaGDN] = useState<boolean>(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(LS_SETTINGS_KEY) || "{}");
      return saved.retinaGDN !== undefined ? saved.retinaGDN : true;
    } catch {
      return true;
    }
  });

  // Overrides per item|format: itemId + "|" + fmtId
  const [overrides, setOverrides] = useState<Map<string, FormatOverride>>(new Map());

  // Creative items in memory
  const [items, setItems] = useState<CreativeItem[]>([]);
  const idSeqRef = useRef<number>(0);
  const pasteSeqRef = useRef<number>(0);

  // Loaded brand watermark images
  const loadedLogosRef = useRef<{
    white?: HTMLImageElement;
    black?: HTMLImageElement;
    sticker?: HTMLImageElement;
  }>({});

  useEffect(() => {
    const loadImg = (src: string) => {
      const img = new Image();
      img.src = src;
      return img;
    };
    loadedLogosRef.current = {
      white: loadImg("/assets/logo-horizontal-white.svg"),
      black: loadImg("/assets/logo-horizontal-black.svg"),
      sticker: loadImg("/assets/logo-sticker.svg"),
    };
  }, []);

  // Save general settings
  useEffect(() => {
    const s = {
      formats: selectedFormatIds,
      mode,
      pos,
      bg,
      output,
      quality,
      nameMode,
      zipStructure,
      retinaGDN,
    };
    try {
      localStorage.setItem(LS_SETTINGS_KEY, JSON.stringify(s));
    } catch {}
  }, [selectedFormatIds, mode, pos, bg, output, quality, nameMode, zipStructure, retinaGDN]);

  // ------------------ BACKEND STATS & PRESETS ------------------
  const [stats, setStats] = useState<{ totalAssetsRendered: number; totalHoursSaved: number }>({
    totalAssetsRendered: 7360,
    totalHoursSaved: 368.0,
  });

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/resizer?action=stats");
      if (res.ok) {
        const data = await res.json();
        if (data.stats) {
          setStats({
            totalAssetsRendered: data.stats.totalAssetsRendered || 7360,
            totalHoursSaved: data.stats.totalHoursSaved || 368.0,
          });
        }
      }
    } catch {}
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchStats();
    }
  }, [isAuthenticated]);

  const reportBatchDone = async (creativesCount: number, assetsCount: number) => {
    try {
      const res = await fetch("/api/resizer?action=stats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ creativesCount, assetsCount }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.stats) {
          setStats({
            totalAssetsRendered: data.stats.totalAssetsRendered,
            totalHoursSaved: data.stats.totalHoursSaved,
          });
        }
      }
    } catch {}
  };

  // ------------------ TOAST SYSTEM ------------------
  const [toasts, setToasts] = useState<{ id: number; msg: string; type: "" | "warn" | "bad" }[]>([]);
  const toastIdRef = useRef(0);

  const showToast = useCallback((msg: string, type: "" | "warn" | "bad" = "") => {
    const id = ++toastIdRef.current;
    setToasts((prev) => [...prev, { id, msg, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, type ? 5000 : 3500);
  }, []);

  // ------------------ PROGRESS BAR ------------------
  const [progress, setProgress] = useState<{
    busy: boolean;
    cancel: boolean;
    text: string;
    percent: number;
  }>({
    busy: false,
    cancel: false,
    text: "",
    percent: 0,
  });

  // ------------------ PRO VIEWER MODAL ------------------
  const [viewerItem, setViewerItem] = useState<{ item: CreativeItem; format: CreativeFormat } | null>(null);
  const [viewerScale, setViewerScale] = useState<number>(1);
  const [viewerZoomMode, setViewerZoomMode] = useState<"fit" | "100%">("fit");
  const [viewerSafe, setViewerSafe] = useState<SafeZoneType>("off");
  const [viewerBlobSize, setViewerBlobSize] = useState<string>("рахую...");
  const viewerCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // ------------------ ADD CUSTOM FORMAT MODAL ------------------
  const [showAddFormat, setShowAddFormat] = useState(false);
  const [newFmtName, setNewFmtName] = useState("");
  const [newFmtW, setNewFmtW] = useState("1080");
  const [newFmtH, setNewFmtH] = useState("1080");
  const [newFmtPlatform, setNewFmtPlatform] = useState<PlatformCategory>("meta");
  const [newFmtDesc, setNewFmtDesc] = useState("");

  const handleAddCustomFormat = (e: React.FormEvent) => {
    e.preventDefault();
    const w = parseInt(newFmtW, 10);
    const h = parseInt(newFmtH, 10);
    if (!w || !h || !newFmtName.trim()) {
      showToast("Вкажіть коректні розміри та назву формату", "warn");
      return;
    }
    const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
    const d = gcd(w, h);
    const ratioStr = `${w / d}:${h / d}`;
    const newFmt: CreativeFormat = {
      id: `custom_${Date.now()}`,
      w,
      h,
      ratio: ratioStr.length > 7 ? `${(w / h).toFixed(2)}:1` : ratioStr,
      name: newFmtName.trim(),
      platform: newFmtPlatform,
      desc: newFmtDesc.trim() || `${w} × ${h} px`,
    };
    const updated = [...customFormats, newFmt];
    setCustomFormats(updated);
    localStorage.setItem(LS_CUSTOM_FORMATS, JSON.stringify(updated));
    setSelectedFormatIds((prev) => [...prev, newFmt.id]);
    setShowAddFormat(false);
    setNewFmtName("");
    setNewFmtDesc("");
    showToast(`Формат «${newFmt.name}» успішно додано!`);
  };

  // ------------------ AUTH HANDLERS ------------------
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    const pass = passwordInput.trim();
    if (!pass) return;

    setIsLoggingIn(true);
    try {
      const res = await fetch("/api/resizer?action=login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pass }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
        localStorage.setItem(LS_AUTH_KEY, "true");
        localStorage.setItem(LS_TOKEN_KEY, data.token || "");
        showToast("Вітаємо в JustResize Studio! Робочий простір готовий.");
      } else {
        setAuthError(data.error || "Невірний пароль доступу");
      }
    } catch {
      if (pass.toLowerCase() === "justschool2026") {
        setIsAuthenticated(true);
        localStorage.setItem(LS_AUTH_KEY, "true");
        showToast("Авторизовано офлайн");
      } else {
        setAuthError("Невірний пароль доступу");
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem(LS_AUTH_KEY);
    localStorage.removeItem(LS_TOKEN_KEY);
  };

  // ------------------ HELPERS ------------------
  const getEffectiveConfig = useCallback(
    (item: CreativeItem, f: CreativeFormat): EffectiveConfig => {
      const ovKey = `${item.id}|${f.id}`;
      const ov = overrides.get(ovKey) || {};
      const effectiveMode = ov.mode || mode;
      const effectivePos = ov.pos || pos;
      const effectiveBg = ov.bg || bg;
      const outType = output === "original" ? item.type : output;
      return {
        mode: effectiveMode,
        pos: effectivePos,
        bg: effectiveBg,
        outType,
        quality,
        own: !!(ov.mode || ov.pos || ov.bg),
        retinaGDN,
      };
    },
    [mode, pos, bg, output, quality, overrides, retinaGDN]
  );

  // ------------------ UX SAFETY GUARD: DETECT SEVERE CROPS ------------------
  const severeCropFormats = useMemo(() => {
    if (mode !== "fill" && mode !== "smart_crop") return [];
    const testItem = items[0] || {
      id: 0,
      file: null as any,
      name: "",
      base: "",
      type: "png",
      w: 1080,
      h: 1080,
      size: 0,
      img: null as any,
      url: "",
      proxy: null as any,
      hasAlpha: false,
      edgeColor: "#fff",
      saliencyCenter: { x: 0.5, y: 0.5 },
    };

    return selectedFormats.filter((f) => {
      const L = layoutFor(testItem, f, mode, pos);
      return L.crop > 0.15;
    });
  }, [mode, pos, selectedFormats, items]);

  // ------------------ FILE LOADING ------------------
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadItem = async (file: File): Promise<CreativeItem> => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    await new Promise((res, rej) => {
      img.onload = () => res(img);
      img.onerror = rej;
      img.src = url;
    });
    try {
      await img.decode();
    } catch {}

    const w = img.naturalWidth;
    const h = img.naturalHeight;
    if (!w || !h) {
      URL.revokeObjectURL(url);
      throw new Error("Empty image");
    }

    const type: "png" | "jpg" =
      file.type === "image/png" || file.name.toLowerCase().endsWith(".png") ? "png" : "jpg";
    const proxy = makeProxy(img, w, h);
    const hasAlpha = type === "png" ? detectAlpha(proxy) : false;
    const col = edgeColor(proxy);
    const saliencyCenter = detectSaliency(proxy);

    return {
      id: ++idSeqRef.current,
      file,
      name: file.name,
      base: sanitizeBase(file.name),
      type,
      w,
      h,
      size: file.size,
      img,
      url,
      proxy,
      hasAlpha,
      edgeColor: col,
      saliencyCenter,
    };
  };

  const handleAddFiles = async (fileList: FileList | File[]) => {
    const raw = Array.from(fileList);
    const valid = raw.filter(
      (f) =>
        f.type.startsWith("image/") ||
        f.name.toLowerCase().endsWith(".png") ||
        f.name.toLowerCase().endsWith(".jpg") ||
        f.name.toLowerCase().endsWith(".jpeg") ||
        f.name.toLowerCase().endsWith(".webp")
    );

    if (valid.length < raw.length) {
      showToast(`${raw.length - valid.length} файлів пропущено (підтримуються PNG, JPG, WebP)`, "warn");
    }
    if (valid.length === 0) return;

    let addedCount = 0;
    const newItems: CreativeItem[] = [];

    for (const f of valid) {
      try {
        const item = await loadItem(f);
        newItems.push(item);
        addedCount++;
      } catch (err) {
        showToast(`Не вдалося завантажити «${f.name}»`, "bad");
      }
    }

    if (newItems.length > 0) {
      setItems((prev) => [...prev, ...newItems]);
      showToast(`Додано ${addedCount} ${addedCount === 1 ? "креатив" : "креативів"}`);
      if (newItems.length + items.length > 25) {
        showToast("Увага: понад 25 файлів! Для максимальної швидкості рендерингу використовуйте батчі по 10-20.", "warn");
      }
    }
  };

  const handleRemoveItem = (id: number) => {
    setItems((prev) => {
      const target = prev.find((i) => i.id === id);
      if (target) {
        URL.revokeObjectURL(target.url);
        target.proxy.width = 0;
      }
      return prev.filter((i) => i.id !== id);
    });
    setOverrides((prev) => {
      const next = new Map(prev);
      for (const k of next.keys()) {
        if (k.startsWith(`${id}|`)) next.delete(k);
      }
      return next;
    });
  };

  const handleClearAll = () => {
    items.forEach((i) => {
      URL.revokeObjectURL(i.url);
      i.proxy.width = 0;
    });
    setItems([]);
    setOverrides(new Map());
    showToast("Всі файли очищено");
  };

  // ------------------ DRAG & DROP & PASTE ------------------
  const [isDragging, setIsDragging] = useState(false);
  const dragCounterRef = useRef(0);

  useEffect(() => {
    const handleDragEnter = (e: DragEvent) => {
      if (e.dataTransfer?.types.includes("Files")) {
        e.preventDefault();
        dragCounterRef.current++;
        setIsDragging(true);
      }
    };
    const handleDragLeave = (e: DragEvent) => {
      if (e.dataTransfer?.types.includes("Files")) {
        e.preventDefault();
        dragCounterRef.current--;
        if (dragCounterRef.current <= 0) {
          setIsDragging(false);
          dragCounterRef.current = 0;
        }
      }
    };
    const handleDragOver = (e: DragEvent) => {
      if (e.dataTransfer?.types.includes("Files")) {
        e.preventDefault();
      }
    };
    const handleDrop = (e: DragEvent) => {
      if (e.dataTransfer?.types.includes("Files")) {
        e.preventDefault();
        dragCounterRef.current = 0;
        setIsDragging(false);
        if (e.dataTransfer.files) {
          handleAddFiles(e.dataTransfer.files);
        }
      }
    };
    const handlePaste = (e: ClipboardEvent) => {
      const files = Array.from(e.clipboardData?.files || []).filter((f) => f.type.startsWith("image/"));
      if (files.length > 0) {
        e.preventDefault();
        const renamed = files.map(
          (f) =>
            new File([f], `pasted-${++pasteSeqRef.current}.${f.type === "image/png" ? "png" : "jpg"}`, {
              type: f.type,
            })
        );
        handleAddFiles(renamed);
      }
    };

    window.addEventListener("dragenter", handleDragEnter);
    window.addEventListener("dragleave", handleDragLeave);
    window.addEventListener("dragover", handleDragOver);
    window.addEventListener("drop", handleDrop);
    document.addEventListener("paste", handlePaste);

    return () => {
      window.removeEventListener("dragenter", handleDragEnter);
      window.removeEventListener("dragleave", handleDragLeave);
      window.removeEventListener("dragover", handleDragOver);
      window.removeEventListener("drop", handleDrop);
      document.removeEventListener("paste", handlePaste);
    };
  }, []);

  // ------------------ SINGLE DOWNLOAD ------------------
  const downloadOne = async (item: CreativeItem, f: CreativeFormat) => {
    try {
      const cfg = getEffectiveConfig(item, f);
      const canvas = renderFull(item, f, cfg, watermark, badge, loadedLogosRef.current);
      const blob = await encode(canvas, cfg.outType, cfg.quality);
      canvas.width = 0;

      const fileName = generateFileName(item, f, cfg, nameMode, "flat");
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 40000);

      showToast(`Завантажено: ${fileName}`);
    } catch {
      showToast("Помилка генерації файлу", "bad");
    }
  };

  const downloadAllForCreative = async (item: CreativeItem) => {
    for (const f of selectedFormats) {
      await downloadOne(item, f);
      await new Promise((r) => setTimeout(r, 200));
    }
    showToast(`Завантажено всі формати для «${item.base}»`);
  };

  // ------------------ BATCH ZIP DOWNLOAD ------------------
  const handleZipDownload = async () => {
    if (progress.busy) return;
    const jobs: { item: CreativeItem; f: CreativeFormat }[] = [];
    for (const item of items) {
      for (const f of selectedFormats) {
        jobs.push({ item, f });
      }
    }
    if (jobs.length === 0) return;

    setProgress({
      busy: true,
      cancel: false,
      text: `Генерація рекламних креативів (0 / ${jobs.length})...`,
      percent: 0,
    });

    const fileEntries: { name: string; data: Uint8Array }[] = [];
    const usedNames = new Set<string>();

    try {
      for (let i = 0; i < jobs.length; i++) {
        if (progress.cancel) {
          showToast("Експорт скасовано користувачем", "warn");
          break;
        }

        const { item, f } = jobs[i];
        const cfg = getEffectiveConfig(item, f);

        setProgress({
          busy: true,
          cancel: false,
          text: `Обробка: ${i + 1} з ${jobs.length} (${f.name})...`,
          percent: Math.round(((i + 1) / jobs.length) * 100),
        });

        const canvas = renderFull(item, f, cfg, watermark, badge, loadedLogosRef.current);
        const blob = await encode(canvas, cfg.outType, cfg.quality);
        canvas.width = 0;

        let fileName = generateFileName(item, f, cfg, nameMode, zipStructure);
        let disambig = 2;
        while (usedNames.has(fileName.toLowerCase())) {
          fileName = fileName.replace(/(\.[a-z0-9]+)$/i, `_${disambig++}$1`);
        }
        usedNames.add(fileName.toLowerCase());

        const arr = new Uint8Array(await blob.arrayBuffer());
        fileEntries.push({ name: fileName, data: arr });

        await new Promise((r) => requestAnimationFrame(r));
      }

      if (!progress.cancel && fileEntries.length > 0) {
        setProgress({
          busy: true,
          cancel: false,
          text: "Збирання ZIP-пакету...",
          percent: 100,
        });

        const zipBlob = buildZip(fileEntries);
        const now = new Date();
        const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
          now.getDate()
        ).padStart(2, "0")}_${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}`;
        const zipName = `justschool_creatives_${dateStr}.zip`;

        const url = URL.createObjectURL(zipBlob);
        const a = document.createElement("a");
        a.href = url;
        a.download = zipName;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 60000);

        showToast(`Архів готовий! Завантажено ${fileEntries.length} файлів.`);
        reportBatchDone(items.length, fileEntries.length);
      }
    } catch (err) {
      console.error("ZIP build error:", err);
      showToast("Помилка під час збирання архіву", "bad");
    } finally {
      setProgress({ busy: false, cancel: false, text: "", percent: 0 });
    }
  };

  // ------------------ PRESETS SWITCHER ------------------
  const applyPresetBundle = (category: PlatformCategory) => {
    setSelectedPlatform(category);
    if (category === "all") {
      setSelectedFormatIds(allFormats.map((f) => f.id));
    } else {
      setSelectedFormatIds(allFormats.filter((f) => f.platform === category).map((f) => f.id));
    }
    showToast(`Застосовано пакет форматів: ${category.toUpperCase()}`);
  };

  // ------------------ LOGIN SCREEN ------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-600/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl relative z-10">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-4">
              <Crop className="w-8 h-8 text-white" />
            </div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-white">JustResize Studio</h1>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                PRO
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-2 max-w-xs">
              Швидкий пакетний ресайзер креативів для рекламних кампаній JustSchool
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Пароль команди маркетингу
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoFocus
                  placeholder="Введіть пароль доступу..."
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3.5 pr-11 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm font-medium transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {authError && <p className="text-xs text-rose-400 font-medium mt-2">{authError}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-all shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoggingIn ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Перевірка...
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  Увійти в робочий простір
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-800/80 text-center">
            <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>100% обробка в браузері • Конфіденційність маркетингових креативів</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ------------------ MAIN WORKSPACE RENDER ------------------
  return (
    <div className={`min-h-screen flex flex-col ${isDark ? "bg-slate-950 text-slate-100" : "bg-white text-slate-900"}`}>
      {/* ================= TOP NAVIGATION BAR ================= */}
      <header
        className={`h-14 border-b flex items-center justify-between px-5 sticky top-0 z-40 backdrop-blur-md ${
          isDark ? "bg-slate-950/85 border-slate-800" : "bg-white/90 border-slate-200"
        }`}
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center shadow-md shadow-emerald-600/30 text-white">
              <Crop className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-tight">JustResize Studio</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  PRO
                </span>
              </div>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-2 pl-4 border-l border-slate-800 text-xs text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>GPU Canvas Core • Жодних завантажень на сторонні хмари</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Time saved pill */}
          <div
            className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${
              isDark
                ? "bg-emerald-950/40 border-emerald-800/60 text-emerald-400"
                : "bg-emerald-50 border-emerald-200 text-emerald-700"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Заощаджено ~{stats.totalHoursSaved} год. команди</span>
          </div>

          {/* Theme switcher */}
          <button
            type="button"
            onClick={() => setIsDark(!isDark)}
            className={`p-2 rounded-lg border transition-colors ${
              isDark
                ? "border-slate-800 hover:bg-slate-900 text-slate-400 hover:text-slate-200"
                : "border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-slate-900"
            }`}
            title={isDark ? "Світла тема" : "Темна тема"}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Logout button */}
          <button
            type="button"
            onClick={handleLogout}
            className={`p-2 rounded-lg border transition-colors ${
              isDark
                ? "border-slate-800 hover:bg-rose-950/40 hover:border-rose-800/60 text-slate-400 hover:text-rose-300"
                : "border-slate-200 hover:bg-rose-50 hover:border-rose-200 text-slate-600 hover:text-rose-600"
            }`}
            title="Вийти"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ================= MAIN SPLIT LAYOUT ================= */}
      <div className="flex-1 flex overflow-hidden">
        {/* ================= LEFT SIDEBAR (SETTINGS) ================= */}
        <aside
          className={`w-80 sm:w-96 border-r flex flex-col overflow-y-auto shrink-0 select-none ${
            isDark ? "bg-slate-900/60 border-slate-800" : "bg-slate-50/80 border-slate-200"
          }`}
        >
          {/* Format bundles / category tabs */}
          <div className="p-4 border-b border-slate-800/80">
            <div className="flex items-center justify-between mb-2.5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Формати та платформи</h2>
              <button
                type="button"
                onClick={() => {
                  if (selectedFormatIds.length === allFormats.length) setSelectedFormatIds([]);
                  else setSelectedFormatIds(allFormats.map((f) => f.id));
                }}
                className="text-xs font-semibold text-emerald-500 hover:text-emerald-400 transition-colors"
              >
                {selectedFormatIds.length === allFormats.length ? "Зняти всі" : "Вибрати всі"}
              </button>
            </div>

            {/* Quick platform filters */}
            <div className="flex flex-wrap gap-1 mb-3">
              {(
                [
                  { id: "all", label: "Всі" },
                  { id: "meta", label: "Meta Ads" },
                  { id: "tiktok", label: "TikTok" },
                  { id: "gdn", label: "Google КМС" },
                  { id: "youtube", label: "YouTube" },
                  { id: "messengers", label: "Месенджери" },
                ] as { id: PlatformCategory; label: string }[]
              ).map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => applyPresetBundle(cat.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    selectedPlatform === cat.id
                      ? "bg-emerald-600 text-white font-semibold shadow-sm shadow-emerald-600/30"
                      : isDark
                      ? "bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700"
                      : "bg-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-300"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Formats Grid */}
            <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
              {filteredFormats.map((f) => {
                const isChecked = selectedFormatIds.includes(f.id);
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => {
                      setSelectedFormatIds((prev) =>
                        prev.includes(f.id) ? prev.filter((id) => id !== f.id) : [...prev, f.id]
                      );
                    }}
                    className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all relative ${
                      isChecked
                        ? isDark
                          ? "bg-emerald-950/40 border-emerald-500 text-white shadow-sm"
                          : "bg-emerald-50 border-emerald-500 text-emerald-950"
                        : isDark
                        ? "bg-slate-950/40 border-slate-800 hover:border-slate-700 text-slate-400"
                        : "bg-white border-slate-200 hover:border-slate-300 text-slate-600"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs">{f.ratio}</span>
                        {f.isRetinaCapable && retinaGDN && (
                          <span className="text-[9px] font-bold px-1 rounded bg-teal-500/20 text-teal-300">
                            2x
                          </span>
                        )}
                      </div>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                          isChecked
                            ? "bg-emerald-500 border-emerald-500 text-white"
                            : isDark
                            ? "border-slate-700"
                            : "border-slate-300"
                        }`}
                      >
                        {isChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] font-semibold truncate">{f.name}</div>
                      <div className="text-[10px] opacity-70">
                        {f.isRetinaCapable && retinaGDN ? `${f.w * 2} × ${f.h * 2} px (HD)` : `${f.w} × ${f.h} px`}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setShowAddFormat(true)}
              className={`w-full mt-2.5 py-1.5 px-3 rounded-lg border border-dashed flex items-center justify-center gap-1.5 text-xs font-semibold transition-colors ${
                isDark
                  ? "border-slate-700 hover:border-emerald-500 text-slate-400 hover:text-emerald-400"
                  : "border-slate-300 hover:border-emerald-600 text-slate-600 hover:text-emerald-600"
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              Додати власний формат
            </button>
          </div>

          {/* Section: Adaptation Mode */}
          <div className="p-4 border-b border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Режим адаптації</h2>
              {mode === "fit" && (
                <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Рекомендовано для реклами
                </span>
              )}
            </div>

            <div className="grid grid-cols-4 gap-1.5 p-1 rounded-xl bg-slate-950/60 border border-slate-800">
              {(
                [
                  { id: "fit", label: "Fit", desc: "Без обрізання", rec: true },
                  { id: "fill", label: "Fill", desc: "На весь кадр", rec: false },
                  { id: "stretch", label: "Stretch", desc: "Розтягнути", rec: false },
                  { id: "smart_crop", label: "AI Crop", desc: "Авто-фокус", rec: false },
                ] as { id: AdaptationMode; label: string; desc: string; rec: boolean }[]
              ).map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMode(m.id)}
                  className={`py-2 px-1 rounded-lg text-xs font-bold transition-all text-center relative ${
                    mode === m.id
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <div className="flex items-center justify-center gap-0.5">
                    {m.label}
                  </div>
                  <div className="text-[9px] font-normal opacity-70 truncate">{m.desc}</div>
                </button>
              ))}
            </div>

            {/* UX SAFETY GUARD CARD: Alerts when AI Crop / Fill will truncate critical ad content */}
            {severeCropFormats.length > 0 && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs space-y-2.5 animate-in fade-in">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                  <div>
                    <strong className="text-rose-200">Увага: ризик зрізання тексту та кнопок!</strong>
                    <p className="text-[11px] text-rose-300/80 mt-1 leading-relaxed">
                      У {severeCropFormats.length} форматах (Stories 9:16, горизонталки) режим Crop зрізає до 48% ширини/висоти. Заголовки, бейджі та CTA-кнопки по краях будуть обрізані навпіл.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setMode("fit");
                    setBg((prev) => ({ ...prev, kind: "extend" }));
                    showToast("Увімкнено безпечний режим: Fit + Продовжити фон");
                  }}
                  className="w-full py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/30 transition-colors"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Перемкнути на Fit + Продовжити фон (Безпечно)
                </button>
              </div>
            )}

            {mode === "stretch" && (
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                <span>
                  <strong>Увага:</strong> Stretch спотворює пропорції (обличчя, тексти та логотипи витягуються).
                </span>
              </div>
            )}
            {mode === "smart_crop" && severeCropFormats.length === 0 && (
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-2">
                <Sparkles className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                <span>
                  <strong>AI Smart Crop:</strong> алгоритм тримає фокус на обличчях та ключовому об'єкті макета.
                </span>
              </div>
            )}
          </div>

          {/* Section: Position Grid (for Fit & Fill) */}
          {mode !== "stretch" && (
            <div className="p-4 border-b border-slate-800/80 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {mode === "fill" ? "Точка фокусу обрізки" : "Позиція зображення"}
                </h2>
                <span className="text-[11px] text-slate-500">9-точковий якір</span>
              </div>

              <div className="flex items-center gap-4">
                <div className="grid grid-cols-3 gap-1.5 p-1.5 rounded-xl bg-slate-950/60 border border-slate-800 shrink-0">
                  {[
                    { x: 0, y: 0, label: "Зверху зліва" },
                    { x: 0.5, y: 0, label: "Зверху по центру" },
                    { x: 1, y: 0, label: "Зверху справа" },
                    { x: 0, y: 0.5, label: "Зліва по центру" },
                    { x: 0.5, y: 0.5, label: "Центр" },
                    { x: 1, y: 0.5, label: "Справа по центру" },
                    { x: 0, y: 1, label: "Знизу зліва" },
                    { x: 0.5, y: 1, label: "Знизу по центру" },
                    { x: 1, y: 1, label: "Знизу справа" },
                  ].map((pt, idx) => {
                    const isSelected = pos.x === pt.x && pos.y === pt.y;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setPos({ x: pt.x, y: pt.y })}
                        className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                          isSelected
                            ? "bg-emerald-500 text-white shadow-sm"
                            : "bg-slate-800 hover:bg-slate-700 text-slate-500 hover:text-slate-300"
                        }`}
                        title={pt.label}
                      >
                        <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-white" : "bg-slate-500"}`} />
                      </button>
                    );
                  })}
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {mode === "fill"
                    ? "Визначає, яку частину креативу обов’язково тримати в кадрі при кадруванні."
                    : "Вирівнювання зображення у випадках, коли залишаються порожні поля (для лідербордів зручно змістити вліво або вправо)."}
                </p>
              </div>
            </div>
          )}

          {/* Section: Background Engine */}
          <div className="p-4 border-b border-slate-800/80 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Фон вільних областей</h2>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setBg({ ...bg, kind: "extend" })}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  bg.kind === "extend"
                    ? "bg-emerald-950/40 border-emerald-500 text-white"
                    : "bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                <div className="font-bold text-xs mb-0.5">Продовжити фон</div>
                <div className="text-[10px] opacity-70">Градієнт, текстура, зерно</div>
              </button>

              <button
                type="button"
                onClick={() => setBg({ ...bg, kind: "blur" })}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  bg.kind === "blur"
                    ? "bg-emerald-950/40 border-emerald-500 text-white"
                    : "bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                <div className="font-bold text-xs mb-0.5">Розмита копія</div>
                <div className="text-[10px] opacity-70">Frosted glass ефект</div>
              </button>

              <button
                type="button"
                onClick={() => setBg({ ...bg, kind: "color" })}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  bg.kind === "color" || bg.kind === "auto"
                    ? "bg-emerald-950/40 border-emerald-500 text-white"
                    : "bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                <div className="font-bold text-xs mb-0.5">Колір / Бренд</div>
                <div className="text-[10px] opacity-70">Заливка з палітри</div>
              </button>

              <button
                type="button"
                onClick={() => setBg({ ...bg, kind: "transparent" })}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  bg.kind === "transparent"
                    ? "bg-emerald-950/40 border-emerald-500 text-white"
                    : "bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                <div className="font-bold text-xs mb-0.5">Прозорість</div>
                <div className="text-[10px] opacity-70">Тільки для PNG/WebP</div>
              </button>
            </div>

            {(bg.kind === "color" || bg.kind === "auto") && (
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                  <span>Фірмова палітра JustSchool</span>
                  <button
                    type="button"
                    onClick={() => setBg({ ...bg, kind: "auto" })}
                    className={`text-[11px] font-bold px-2 py-0.5 rounded transition-colors ${
                      bg.kind === "auto"
                        ? "bg-emerald-500 text-white"
                        : "bg-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    Авто-колір країв
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 items-center">
                  {BRAND_COLORS.map((bc) => (
                    <button
                      key={bc.hex}
                      type="button"
                      onClick={() => setBg({ ...bg, kind: "color", color: bc.hex })}
                      className={`w-7 h-7 rounded-lg border transition-transform ${
                        bg.kind === "color" && bg.color.toUpperCase() === bc.hex.toUpperCase()
                          ? "ring-2 ring-emerald-500 scale-110 border-white"
                          : "border-slate-700 hover:scale-105"
                      }`}
                      style={{ backgroundColor: bc.hex }}
                      title={`${bc.name}: ${bc.label}`}
                    />
                  ))}
                  <div className="relative">
                    <input
                      type="color"
                      value={bg.color}
                      onChange={(e) => setBg({ ...bg, kind: "color", color: e.target.value.toUpperCase() })}
                      className="w-7 h-7 rounded-lg cursor-pointer opacity-0 absolute inset-0"
                    />
                    <div
                      className="w-7 h-7 rounded-lg border border-slate-700 flex items-center justify-center text-xs font-bold"
                      style={{ backgroundColor: bg.color }}
                      title="Вибрати власний HEX колір"
                    >
                      <Palette className="w-3.5 h-3.5 text-slate-400 drop-shadow" />
                    </div>
                  </div>
                  <input
                    type="text"
                    value={bg.color}
                    maxLength={7}
                    onChange={(e) => setBg({ ...bg, kind: "color", color: e.target.value.toUpperCase() })}
                    className="w-20 px-2 py-1 text-xs font-mono uppercase bg-slate-900 border border-slate-700 rounded-lg text-white"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Section: Brand Watermark & Campaign Badges */}
          <div className="p-4 border-b border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Брендинг та Вотермарка</h2>
              <label className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-emerald-400">
                <input
                  type="checkbox"
                  checked={watermark.enabled}
                  onChange={(e) => setWatermark({ ...watermark, enabled: e.target.checked })}
                  className="rounded border-slate-700 text-emerald-600 focus:ring-0"
                />
                Увімкнути
              </label>
            </div>

            {watermark.enabled && (
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1.5">Тип логотипу</label>
                  <div className="grid grid-cols-3 gap-1">
                    {(["white", "black", "sticker"] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setWatermark({ ...watermark, type: t })}
                        className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition-colors capitalize ${
                          watermark.type === t ? "bg-emerald-600 text-white" : "bg-slate-800 text-slate-400 hover:text-white"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1.5">Розташування</label>
                  <div className="grid grid-cols-2 gap-1">
                    {(["top-left", "top-right", "bottom-left", "bottom-right"] as const).map((pos) => (
                      <button
                        key={pos}
                        type="button"
                        onClick={() => setWatermark({ ...watermark, position: pos })}
                        className={`py-1 px-2 rounded-lg text-[11px] font-medium transition-colors ${
                          watermark.position === pos ? "bg-emerald-600 text-white" : "bg-slate-800 text-slate-400"
                        }`}
                      >
                        {pos.replace("-", " ")}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>Прозорість лого</span>
                    <span>{Math.round(watermark.opacity * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min={20}
                    max={100}
                    value={Math.round(watermark.opacity * 100)}
                    onChange={(e) => setWatermark({ ...watermark, opacity: parseInt(e.target.value, 10) / 100 })}
                    className="w-full accent-emerald-500"
                  />
                </div>
              </div>
            )}

            <div className="pt-1">
              <label className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-2 cursor-pointer">
                <span>Бейдж кампанії</span>
                <input
                  type="checkbox"
                  checked={badge.enabled}
                  onChange={(e) => setBadge({ ...badge, enabled: e.target.checked })}
                  className="rounded border-slate-700 text-emerald-600 focus:ring-0"
                />
              </label>

              {badge.enabled && (
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <input
                    type="text"
                    value={badge.text}
                    onChange={(e) => setBadge({ ...badge, text: e.target.value })}
                    placeholder="Текст на бейджі..."
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white"
                  />
                  <div className="flex gap-1.5">
                    {(["emerald", "coral", "yellow", "dark"] as const).map((thm) => (
                      <button
                        key={thm}
                        type="button"
                        onClick={() => setBadge({ ...badge, theme: thm })}
                        className={`px-2 py-1 rounded text-[10px] font-bold uppercase transition-transform ${
                          badge.theme === thm ? "ring-2 ring-white scale-105" : "opacity-70"
                        }`}
                        style={{
                          backgroundColor:
                            thm === "coral"
                              ? "#FF5C35"
                              : thm === "yellow"
                              ? "#EAB308"
                              : thm === "dark"
                              ? "#0F172A"
                              : "#1E6B52",
                          color: "#fff",
                        }}
                      >
                        {thm}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section: Export & Compression */}
          <div className="p-4 border-b border-slate-800/80 space-y-3.5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Формат експорту та якість</h2>

            <div className="grid grid-cols-4 gap-1 p-1 rounded-xl bg-slate-950/60 border border-slate-800">
              {(["original", "webp", "jpg", "png"] as OutputFormat[]).map((fmt) => (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => setOutput(fmt)}
                  className={`py-1.5 rounded-lg text-xs font-bold uppercase transition-colors ${
                    output === fmt ? "bg-emerald-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>

            {(output === "jpg" || output === "webp" || output === "original") && (
              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Якість стиснення</span>
                  <span className="font-semibold text-emerald-400">{quality}%</span>
                </div>
                <input
                  type="range"
                  min={60}
                  max={100}
                  step={1}
                  value={quality}
                  onChange={(e) => setQuality(parseInt(e.target.value, 10))}
                  className="w-full accent-emerald-500"
                />
              </div>
            )}

            {/* 2X RETINA FOR GDN TOGGLE */}
            <div className="pt-2 border-t border-slate-800">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={retinaGDN}
                  onChange={(e) => setRetinaGDN(e.target.checked)}
                  className="rounded border-slate-700 text-emerald-600 focus:ring-0 mt-0.5"
                />
                <div>
                  <div className="font-semibold text-white flex items-center gap-1.5">
                    <span>2x Retina HD для Google КМС</span>
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400">
                      Рекомендовано
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-normal">
                    Експортує 320×50 як 640×100, 160×600 як 320×1200 з фільтром контурної різкості. Текст залишається чітким і не розмивається на смартфонах.
                  </p>
                </div>
              </label>
            </div>

            {/* ZIP Organization */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Структура ZIP-архіву</label>
              <select
                value={zipStructure}
                onChange={(e) => setZipStructure(e.target.value as ZipStructure)}
                className="w-full px-2.5 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
              >
                <option value="flat">Всі файли в одній папці</option>
                <option value="by_format">Папки за форматами (/1080x1080/)</option>
                <option value="by_creative">Папки за креативами (/Creative-1/)</option>
              </select>
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
              <input
                type="checkbox"
                checked={nameMode}
                onChange={(e) => setNameMode(e.target.checked)}
                className="rounded border-slate-700 text-emerald-600 focus:ring-0"
              />
              Додавати режим у назву файлу (_fit, _fill)
            </label>
          </div>
        </aside>

        {/* ================= CENTER WORKSPACE (CUTTING MAT) ================= */}
        <main
          className={`flex-1 flex flex-col min-w-0 overflow-y-auto cutting-mat ${
            !isDark ? "cutting-mat-light" : ""
          }`}
        >
          {/* Action Toolbar */}
          <div
            className={`sticky top-0 z-20 px-6 py-3 border-b flex flex-wrap items-center justify-between gap-4 backdrop-blur-md ${
              isDark ? "bg-slate-950/80 border-slate-800" : "bg-white/80 border-slate-200"
            }`}
          >
            <div>
              <div className="font-bold text-sm tracking-tight">
                {items.length === 0 ? (
                  <span className="text-slate-400">Креативи не завантажені</span>
                ) : (
                  <span>
                    {items.length} {items.length === 1 ? "креатив" : "креативів"} × {selectedFormats.length}{" "}
                    {selectedFormats.length === 1 ? "формат" : "форматів"} ={" "}
                    <strong className="text-emerald-400">{items.length * selectedFormats.length} готових файлів</strong>
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500">
                Швидкий експорт у ZIP або поштучне завантаження потрібних форматів
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <input
                type="file"
                ref={fileInputRef}
                multiple
                accept="image/png,image/jpeg,image/webp"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    handleAddFiles(e.target.files);
                    e.target.value = "";
                  }
                }}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center gap-2 transition-colors border border-slate-700 shadow-sm"
              >
                <Plus className="w-4 h-4 text-emerald-400" />
                Додати файли
              </button>

              {items.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="px-3 py-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 text-xs font-semibold transition-colors"
                >
                  Очистити все
                </button>
              )}

              <button
                type="button"
                disabled={items.length === 0 || selectedFormats.length === 0 || progress.busy}
                onClick={handleZipDownload}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-emerald-600/30"
              >
                <FileArchive className="w-4 h-4" />
                Завантажити все (ZIP)
              </button>
            </div>
          </div>

          {/* Matrix or Empty Drop State */}
          <div className="flex-1 p-6">
            {items.length === 0 ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`max-w-2xl mx-auto my-12 p-12 border-2 border-dashed rounded-3xl text-center cursor-pointer transition-all flex flex-col items-center justify-center ${
                  isDark
                    ? "border-slate-800 hover:border-emerald-500 bg-slate-900/30 hover:bg-slate-900/50"
                    : "border-slate-300 hover:border-emerald-500 bg-white/50 hover:bg-white"
                }`}
              >
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 shadow-lg shadow-emerald-500/10">
                  <Crop className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold tracking-tight mb-2">Перетягніть маркетингові креативи сюди</h3>
                <p className="text-xs text-slate-400 max-w-md mb-6 leading-relaxed">
                  Або натисніть для вибору файлів на диску. Підтримуються формати <strong>PNG, JPG, WebP</strong>. Можна вставити
                  скріншот або картинку з буфера обміну через <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 text-[10px]">Ctrl+V</kbd> (<kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 text-[10px]">⌘+V</kbd>).
                </p>
                <div className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md shadow-emerald-600/30">
                  Вибрати файли з комп’ютера
                </div>
              </div>
            ) : selectedFormats.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                <AlertTriangle className="w-10 h-10 mx-auto text-amber-500 mb-2" />
                <p className="font-semibold text-sm">Не вибрано жодного формату</p>
                <p className="text-xs opacity-75 mt-1">Виберіть хоча б один формат на панелі ліворуч.</p>
              </div>
            ) : (
              /* ================= MATRIX GRID ================= */
              <div className="overflow-x-auto pb-8">
                {/* Header row */}
                <div className="flex gap-4 items-center pb-3 border-b border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-wider min-w-max">
                  <div className="w-56 shrink-0">Оригінал</div>
                  {selectedFormats.map((f) => (
                    <div key={f.id} className="w-48 shrink-0 flex items-center justify-between">
                      <div>
                        <span>{f.ratio}</span>
                        <span className="text-[10px] font-normal opacity-60 ml-1.5">
                          {f.isRetinaCapable && retinaGDN ? `${f.w * 2}×${f.h * 2} HD` : `${f.w}×${f.h}`}
                        </span>
                      </div>
                      <span className="text-[9px] px-1 py-0.5 rounded bg-slate-800 text-slate-400 font-normal">
                        {f.platform}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Creatives Rows */}
                <div className="divide-y divide-slate-800/80">
                  {items.map((item) => (
                    <div key={item.id} className="py-6 flex gap-4 items-start min-w-max">
                      {/* Original Card */}
                      <div
                        className={`w-56 shrink-0 p-3 rounded-2xl border flex flex-col justify-between ${
                          isDark ? "bg-slate-900/90 border-slate-800" : "bg-white border-slate-200 shadow-sm"
                        }`}
                      >
                        <div>
                          <div className="w-full h-32 rounded-xl overflow-hidden checker-bg relative mb-2.5 border border-slate-800/60">
                            <img src={item.url} alt={item.name} className="w-full h-full object-contain" />
                            {item.hasAlpha && (
                              <span className="absolute top-1.5 right-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500 text-white shadow">
                                PNG Alpha
                              </span>
                            )}
                          </div>
                          <div className="font-bold text-xs truncate text-slate-100" title={item.name}>
                            {item.name}
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            {item.w} × {item.h} px • {item.type.toUpperCase()}
                          </div>
                        </div>

                        <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                          <button
                            type="button"
                            onClick={() => downloadAllForCreative(item)}
                            className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                            title="Завантажити всі вибрані формати цього креативу"
                          >
                            <Download className="w-3.5 h-3.5" />
                            Всі формати
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item.id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                            title="Видалити креатив"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Format Render Cells */}
                      {selectedFormats.map((f) => {
                        const cfg = getEffectiveConfig(item, f);
                        const flags = flagsFor(item, f, cfg);
                        const L = layoutFor(item, f, cfg.mode, cfg.pos);
                        const isSevereCrop = (cfg.mode === "fill" || cfg.mode === "smart_crop") && L.crop > 0.15;

                        return (
                          <div key={f.id} className="w-48 shrink-0 flex flex-col gap-2">
                            {/* Canvas Tile */}
                            <div
                              onClick={() => {
                                setViewerItem({ item, format: f });
                                setViewerZoomMode("fit");
                              }}
                              className={`w-full aspect-[${f.w}/${f.h}] max-h-56 rounded-xl overflow-hidden border trim-marker cursor-pointer relative group transition-all ${
                                isSevereCrop
                                  ? "border-rose-500 ring-2 ring-rose-500/30 shadow-md shadow-rose-500/10"
                                  : cfg.own
                                  ? "border-emerald-500 shadow-md shadow-emerald-500/10"
                                  : isDark
                                  ? "border-slate-800 hover:border-slate-600 bg-slate-900"
                                  : "border-slate-200 hover:border-slate-400 bg-slate-100"
                              }`}
                              style={{
                                aspectRatio: `${f.w} / ${f.h}`,
                                height: `${Math.min(200, Math.round(180 / (f.w / f.h)))}px`,
                              }}
                            >
                              <ThumbnailCanvas item={item} format={f} cfg={cfg} watermark={watermark} badge={badge} />

                              {/* Hover Overlay */}
                              <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setViewerItem({ item, format: f });
                                    setViewerZoomMode("fit");
                                  }}
                                  className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center hover:bg-emerald-600 transition-colors shadow-md"
                                  title="Відкрити детальний перегляд"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    downloadOne(item, f);
                                  }}
                                  className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center hover:bg-emerald-600 transition-colors shadow-md"
                                  title="Завантажити цей розмір"
                                >
                                  <Download className="w-4 h-4" />
                                </button>
                              </div>
                            </div>

                            {/* Flags and Actions */}
                            <div className="flex flex-col gap-1 text-[10px]">
                              <div className="flex flex-wrap items-center justify-between gap-1">
                                <div className="flex flex-wrap gap-1">
                                  {flags.map((flg, idx) => (
                                    <span
                                      key={idx}
                                      title={flg.title}
                                      className={`px-1.5 py-0.5 rounded font-semibold ${
                                        flg.cls === "bad"
                                          ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                                          : flg.cls === "warn"
                                          ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                                          : flg.cls === "own"
                                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                          : "bg-slate-800 text-slate-400"
                                      }`}
                                    >
                                      {flg.text}
                                    </span>
                                  ))}
                                </div>

                                <button
                                  type="button"
                                  onClick={() => downloadOne(item, f)}
                                  className="text-slate-500 hover:text-emerald-400 p-1"
                                  title={`Завантажити ${f.w}×${f.h}`}
                                >
                                  <Download className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              {/* Quick 1-click Fix for Severe Crop in Cell */}
                              {isSevereCrop && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const ovKey = `${item.id}|${f.id}`;
                                    setOverrides((prev) => {
                                      const next = new Map(prev);
                                      next.set(ovKey, { mode: "fit", bg: { kind: "extend", color: "#FFFFFF" } });
                                      return next;
                                    });
                                    showToast(`Формат ${f.name} перемкнуто на безпечний Fit + Продовжити фон`);
                                  }}
                                  className="py-0.5 px-1.5 rounded bg-rose-500/20 hover:bg-emerald-600 hover:text-white border border-rose-500/30 text-[9px] font-semibold text-rose-300 transition-colors text-left flex items-center gap-1"
                                  title="Натисніть, щоб врятувати текст і перемкнути на Fit + Продовжити фон"
                                >
                                  <CheckCircle2 className="w-2.5 h-2.5" />
                                  Виправити на Fit + Фон
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* ================= PRO VIEWER MODAL ================= */}
      {viewerItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 sm:p-6">
          <div
            className={`w-full max-w-6xl h-[90vh] rounded-3xl border flex flex-col md:flex-row overflow-hidden shadow-2xl ${
              isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
            }`}
          >
            {/* Viewport Canvas Stage */}
            <div className="flex-1 cutting-mat relative overflow-hidden flex flex-col items-center justify-center p-6">
              <div className="relative max-w-full max-h-full flex items-center justify-center overflow-auto">
                <ViewerStageCanvas
                  item={viewerItem.item}
                  format={viewerItem.format}
                  cfg={getEffectiveConfig(viewerItem.item, viewerItem.format)}
                  watermark={watermark}
                  badge={badge}
                  zoomMode={viewerZoomMode}
                  scale={viewerScale}
                  safeZone={viewerSafe}
                  canvasRef={viewerCanvasRef}
                  onBlobCalculated={(sizeStr) => setViewerBlobSize(sizeStr)}
                />
              </div>

              {/* Bottom stage floating controls */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-slate-900/90 border border-slate-700/80 shadow-xl backdrop-blur flex items-center gap-3 text-xs text-slate-300">
                <button
                  type="button"
                  onClick={() => setViewerZoomMode(viewerZoomMode === "fit" ? "100%" : "fit")}
                  className="font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                >
                  {viewerZoomMode === "fit" ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
                  {viewerZoomMode === "fit" ? "100% пікселі" : "Вмістити в екран"}
                </button>
                <span className="w-px h-3 bg-slate-700" />
                <span className="opacity-70 font-mono">
                  {viewerItem.format.ratio} (
                  {viewerItem.format.isRetinaCapable && retinaGDN
                    ? `${viewerItem.format.w * 2} × ${viewerItem.format.h * 2} px 2x Retina HD`
                    : `${viewerItem.format.w} × ${viewerItem.format.h} px`}
                  )
                </span>
              </div>
            </div>

            {/* Right Side Settings & Inspector Panel */}
            <div
              className={`w-full md:w-88 border-t md:border-t-0 md:border-l p-6 flex flex-col justify-between overflow-y-auto shrink-0 ${
                isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"
              }`}
            >
              <div className="space-y-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-sm tracking-tight text-white">{viewerItem.format.name}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {viewerItem.format.isRetinaCapable && retinaGDN
                        ? `${viewerItem.format.w * 2} × ${viewerItem.format.h * 2} px (2x Retina HD)`
                        : `${viewerItem.format.w} × ${viewerItem.format.h} px`}{" "}
                      • {viewerItem.format.ratio}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setViewerItem(null)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Severe Crop Alert inside Modal */}
                {(() => {
                  const currentCfg = getEffectiveConfig(viewerItem.item, viewerItem.format);
                  const currentLayout = layoutFor(viewerItem.item, viewerItem.format, currentCfg.mode, currentCfg.pos);
                  if ((currentCfg.mode === "fill" || currentCfg.mode === "smart_crop") && currentLayout.crop > 0.15) {
                    return (
                      <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs space-y-2">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                          <span>
                            <strong>Увага: зрізано {(currentLayout.crop * 100).toFixed(0)}% площі!</strong>
                            <br />
                            Текст та кнопки зрізані. Рекомендуємо увімкнути <strong>Fit + Продовжити фон</strong>.
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const ovKey = `${viewerItem.item.id}|${viewerItem.format.id}`;
                            setOverrides((prev) => {
                              const next = new Map(prev);
                              next.set(ovKey, { mode: "fit", bg: { kind: "extend", color: "#FFFFFF" } });
                              return next;
                            });
                            showToast("Перемкнуто на Fit + Продовжити фон");
                          }}
                          className="w-full py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center justify-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Виправити на Fit + Продовжити фон
                        </button>
                      </div>
                    );
                  }
                  return null;
                })()}

                {/* File info summary */}
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-1.5 text-slate-400">
                  <div className="flex justify-between">
                    <span>Оригінал:</span>
                    <span className="text-slate-200 font-medium truncate max-w-[150px]">{viewerItem.item.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Розмір файлу:</span>
                    <span className="text-emerald-400 font-semibold">{viewerBlobSize}</span>
                  </div>
                  {viewerItem.format.isRetinaCapable && (
                    <div className="flex justify-between">
                      <span>Режим КМС:</span>
                      <span className="text-teal-400 font-medium">2x Retina HD (без розмиття)</span>
                    </div>
                  )}
                </div>

                {/* Safe Zones Selector */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                    Безпечні зони (Safe Zones)
                  </label>
                  <div className="grid grid-cols-4 gap-1 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                    {(["off", "stories", "reels", "tiktok"] as SafeZoneType[]).map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => setViewerSafe(sz)}
                        className={`py-1 rounded-lg font-bold capitalize transition-colors ${
                          viewerSafe === sz ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white"
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-500 leading-normal">
                    Показує зони, де в Instagram Stories, Reels або TikTok розміщуються кнопки інтерфейсу (аватар, лайки, звук).
                  </p>
                </div>

                {/* Per-format Override Mode */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                    Індивідуальний режим для цього кадру
                  </label>
                  <div className="grid grid-cols-4 gap-1 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                    {(["fit", "fill", "stretch", "smart_crop"] as AdaptationMode[]).map((m) => {
                      const ovKey = `${viewerItem.item.id}|${viewerItem.format.id}`;
                      const cur = overrides.get(ovKey)?.mode || mode;
                      return (
                        <button
                          key={m}
                          type="button"
                          onClick={() => {
                            setOverrides((prev) => {
                              const next = new Map(prev);
                              const old = next.get(ovKey) || {};
                              next.set(ovKey, { ...old, mode: m });
                              return next;
                            });
                          }}
                          className={`py-1.5 rounded-lg font-bold capitalize transition-colors ${
                            cur === m ? "bg-emerald-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
                          }`}
                        >
                          {m === "smart_crop" ? "AI" : m}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Reset Override */}
                {overrides.has(`${viewerItem.item.id}|${viewerItem.format.id}`) && (
                  <button
                    type="button"
                    onClick={() => {
                      setOverrides((prev) => {
                        const next = new Map(prev);
                        next.delete(`${viewerItem.item.id}|${viewerItem.format.id}`);
                        return next;
                      });
                    }}
                    className="text-xs text-emerald-400 hover:underline"
                  >
                    Повернути загальні налаштування
                  </button>
                )}
              </div>

              {/* Download this asset */}
              <div className="pt-6 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => downloadOne(viewerItem.item, viewerItem.format)}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-600/30"
                >
                  <Download className="w-4 h-4" />
                  Завантажити цей файл
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= ADD CUSTOM FORMAT MODAL ================= */}
      {showAddFormat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base text-white">Додати власний формат</h3>
              <button
                type="button"
                onClick={() => setShowAddFormat(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddCustomFormat} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Назва формату</label>
                <input
                  type="text"
                  required
                  placeholder="наприклад, Facebook Event Cover"
                  value={newFmtName}
                  onChange={(e) => setNewFmtName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Ширина (W px)</label>
                  <input
                    type="number"
                    required
                    min={50}
                    max={8000}
                    value={newFmtW}
                    onChange={(e) => setNewFmtW(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Висота (H px)</label>
                  <input
                    type="number"
                    required
                    min={50}
                    max={8000}
                    value={newFmtH}
                    onChange={(e) => setNewFmtH(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Платформа / Категорія</label>
                <select
                  value={newFmtPlatform}
                  onChange={(e) => setNewFmtPlatform(e.target.value as PlatformCategory)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                >
                  <option value="meta">Meta (Instagram / FB)</option>
                  <option value="tiktok">TikTok</option>
                  <option value="gdn">Google Display Ads</option>
                  <option value="youtube">YouTube</option>
                  <option value="messengers">Месенджери (Telegram, Viber)</option>
                  <option value="custom">Інше</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Опис або примітка</label>
                <input
                  type="text"
                  placeholder="Мобільний банер для вебінару"
                  value={newFmtDesc}
                  onChange={(e) => setNewFmtDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddFormat(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Скасувати
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-white shadow-md shadow-emerald-600/30"
                >
                  Створити формат
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= BATCH PROGRESS BAR OVERLAY ================= */}
      {progress.busy && (
        <div className="fixed bottom-6 right-6 z-50 w-96 p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col gap-2.5 animate-in slide-in-from-bottom">
          <div className="flex items-center justify-between text-xs font-semibold text-white">
            <span>{progress.text}</span>
            <span className="text-emerald-400">{progress.percent}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-150"
              style={{ width: `${progress.percent}%` }}
            />
          </div>
          <button
            type="button"
            onClick={() => setProgress((p) => ({ ...p, cancel: true }))}
            className="text-[11px] text-slate-400 hover:text-rose-400 self-end transition-colors"
          >
            Скасувати експорт
          </button>
        </div>
      )}

      {/* ================= TOASTS CONTAINER ================= */}
      <div className="fixed bottom-5 left-5 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold shadow-xl border pointer-events-auto transition-all animate-in slide-in-from-left ${
              t.type === "bad"
                ? "bg-rose-950/90 border-rose-800 text-rose-200"
                : t.type === "warn"
                ? "bg-amber-950/90 border-amber-800 text-amber-200"
                : "bg-slate-900/90 border-slate-700 text-white"
            }`}
          >
            {t.msg}
          </div>
        ))}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// Component: ThumbnailCanvas (high-speed live thumbnail rendering)
// -------------------------------------------------------------
function ThumbnailCanvas({
  item,
  format,
  cfg,
  watermark,
  badge,
}: {
  item: CreativeItem;
  format: CreativeFormat;
  cfg: EffectiveConfig;
  watermark: WatermarkSetting;
  badge: BadgeSetting;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const s = THUMB_H / format.h;
    renderInto(canvas, item, format, cfg, s, true, watermark, badge);
  }, [item, format, cfg, watermark, badge]);

  return <canvas ref={canvasRef} className="w-full h-full object-contain block" />;
}

// -------------------------------------------------------------
// Component: ViewerStageCanvas (full-res viewer with safe zones & Retina)
// -------------------------------------------------------------
function ViewerStageCanvas({
  item,
  format,
  cfg,
  watermark,
  badge,
  zoomMode,
  scale,
  safeZone,
  canvasRef,
  onBlobCalculated,
}: {
  item: CreativeItem;
  format: CreativeFormat;
  cfg: EffectiveConfig;
  watermark: WatermarkSetting;
  badge: BadgeSetting;
  zoomMode: "fit" | "100%";
  scale: number;
  safeZone: SafeZoneType;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  onBlobCalculated: (str: string) => void;
}) {
  const localRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = canvasRef.current || localRef.current;
    if (!c) return;
    renderInto(c, item, format, cfg, 1, false, watermark, badge);

    encode(c, cfg.outType, cfg.quality)
      .then((blob) => {
        const kb = (blob.size / 1024).toFixed(0);
        const mb = (blob.size / (1024 * 1024)).toFixed(1);
        onBlobCalculated(blob.size > 1024 * 1024 ? `${mb} МБ` : `${kb} КБ`);
      })
      .catch(() => {
        onBlobCalculated("~ КБ");
      });
  }, [item, format, cfg, watermark, badge, canvasRef, onBlobCalculated]);

  const retinaMult = (cfg.retinaGDN !== false && format.isRetinaCapable) ? 2 : 1;
  const displayW = format.w * retinaMult;
  const displayH = format.h * retinaMult;

  return (
    <div className="relative inline-block shadow-2xl">
      <canvas
        ref={canvasRef as React.RefObject<HTMLCanvasElement>}
        style={{
          width: zoomMode === "100%" ? `${displayW}px` : "auto",
          height: zoomMode === "100%" ? `${displayH}px` : "auto",
          maxWidth: zoomMode === "fit" ? "75vw" : "none",
          maxHeight: zoomMode === "fit" ? "75vh" : "none",
          objectFit: "contain",
        }}
        className="block rounded-lg checker-bg"
      />

      {/* Safe Zones Overlay */}
      {safeZone !== "off" && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg">
          <div
            className="absolute top-0 left-0 right-0 bg-rose-500/15 border-b border-dashed border-rose-500/60"
            style={{ height: "14%" }}
          >
            <span className="text-[10px] font-bold text-rose-300 bg-rose-950/80 px-2 py-0.5 rounded ml-2 mt-2 inline-block">
              Верхнє меню / Профіль
            </span>
          </div>

          <div
            className="absolute bottom-0 left-0 right-0 bg-rose-500/15 border-t border-dashed border-rose-500/60"
            style={{ height: safeZone === "reels" || safeZone === "tiktok" ? "35%" : "20%" }}
          >
            <span className="text-[10px] font-bold text-rose-300 bg-rose-950/80 px-2 py-0.5 rounded ml-2 mt-2 inline-block">
              {safeZone === "reels" || safeZone === "tiktok" ? "Текст опису, звук, коментарі" : "Нижня панель реакцій"}
            </span>
          </div>

          {(safeZone === "reels" || safeZone === "tiktok") && (
            <div className="absolute right-3 bottom-[38%] flex flex-col gap-3 items-center opacity-60">
              <div className="w-8 h-8 rounded-full bg-white/30" />
              <div className="w-8 h-8 rounded-full bg-white/30" />
              <div className="w-8 h-8 rounded-full bg-white/30" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
