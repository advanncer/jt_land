import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Link2,
  TrendingUp,
  Split,
  Plus,
  Play,
  Pause,
  RotateCcw,
  Trash2,
  Copy,
  Check,
  ExternalLink,
  Users,
  Target,
  DollarSign,
  BarChart3,
  Layers,
  Lock,
  LogOut,
  ShieldCheck,
  KeyRound,
} from "lucide-react";

interface Variant {
  id: string;
  name: string;
  url: string;
  weight: number;
  visits: number;
  leads: number;
  paid: number;
}

interface Experiment {
  id: string;
  name: string;
  slug: string;
  status: "active" | "paused";
  createdAt: string;
  variants: Variant[];
}

const PRESET_LANDINGS = [
  { name: "English Adult: Main LP", url: "/eng-adult/lp1" },
  { name: "English Adult: Pain Points LP", url: "/eng-adult/lp_pains" },
  { name: "English Adult: Telegram Funnel", url: "/eng-adult/lp1-tg" },
  { name: "English Adult: Check-Up LP", url: "/eng-adult/lp-check-up" },
  { name: "English Adult: Check-Up Dark", url: "/eng-adult/lp-check-up-dark" },
  { name: "English Adult: Reviews LP", url: "/eng-adult/lp-reviews" },
  { name: "English Adult: 120 Days Course", url: "/eng-adult/120-days" },
  { name: "English Child: Main LP", url: "/eng-child/lp-js-child" },
  { name: "English Child: Dark Quiz (BO v1)", url: "/eng-child/quiz-bo-v1" },
  { name: "English Child: White Quiz (BO v1)", url: "/eng-child/quiz-bo-v1-white" },
  { name: "Lead Magnet: Combo Free Product", url: "/free-products/combo-lead-magnit" },
  { name: "Lead Magnet: Astro English", url: "/free-products/astro-english" },
  { name: "Blogger: Partner LP 1", url: "/blogger/lp1" },
];

export default function SplitterApp() {
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem("js_splitter_auth") === "true";
  });
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState("");

  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedExp, setSelectedExp] = useState<Experiment | null>(null);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"dashboard" | "create">("dashboard");

  // Create Form State
  const [formName, setFormName] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [variantAUrl, setVariantAUrl] = useState(PRESET_LANDINGS[0].url);
  const [variantAName, setVariantAName] = useState(PRESET_LANDINGS[0].name);
  const [variantBUrl, setVariantBUrl] = useState(PRESET_LANDINGS[1].url);
  const [variantBName, setVariantBName] = useState(PRESET_LANDINGS[1].name);
  const [weightA, setWeightA] = useState(50);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // UTM Generator State
  const [utmSource, setUtmSource] = useState("facebook");
  const [utmMedium, setUtmMedium] = useState("cpc");
  const [utmCampaign, setUtmCampaign] = useState("smart_split_test");

  // Auth Handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default master password for backend dashboard access
    if (passwordInput.trim() === "justschool2026" || passwordInput.trim() === "admin" || passwordInput.trim() === "justschool") {
      setIsAuthenticated(true);
      localStorage.setItem("js_splitter_auth", "true");
      setAuthError("");
    } else {
      setAuthError("Неверный пароль доступа");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("js_splitter_auth");
  };

  // Fetch Experiments
  const fetchExperiments = async () => {
    try {
      const res = await fetch("/api/split");
      const data = await res.json();
      if (data.experiments) {
        setExperiments(data.experiments);
        if (!selectedExp && data.experiments.length > 0) {
          setSelectedExp(data.experiments[0]);
        } else if (selectedExp) {
          const updated = data.experiments.find((e: Experiment) => e.id === selectedExp.id);
          if (updated) setSelectedExp(updated);
        }
      }
    } catch (err) {
      console.error("Failed to load experiments", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchExperiments();
      const interval = setInterval(fetchExperiments, 10000); // 10s auto-refresh
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formSlug) return;
    setIsSubmitting(true);

    try {
      const payload = {
        name: formName,
        slug: formSlug.toLowerCase().replace(/[^a-z0-9-_]/g, "-"),
        variants: [
          {
            id: "var_a",
            name: variantAName || "Variant A",
            url: variantAUrl,
            weight: weightA,
          },
          {
            id: "var_b",
            name: variantBName || "Variant B",
            url: variantBUrl,
            weight: 100 - weightA,
          },
        ],
      };

      const res = await fetch("/api/split", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        await fetchExperiments();
        setActiveTab("dashboard");
        setFormName("");
        setFormSlug("");
      }
    } catch (err) {
      alert("Error creating split test");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (exp: Experiment) => {
    const updatedStatus = exp.status === "active" ? "paused" : "active";
    try {
      await fetch("/api/split", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...exp, status: updatedStatus }),
      });
      fetchExperiments();
    } catch (err) {
      console.error(err);
    }
  };

  const handleResetStats = async (expId: string) => {
    if (!confirm("Сбросить статистику по этому сплиту?")) return;
    try {
      await fetch(`/api/split?id=${expId}&resetOnly=true`, { method: "DELETE" });
      fetchExperiments();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (expId: string) => {
    if (!confirm("Удалить этот сплит-тест?")) return;
    try {
      await fetch(`/api/split?id=${expId}`, { method: "DELETE" });
      setSelectedExp(null);
      fetchExperiments();
    } catch (err) {
      console.error(err);
    }
  };

  const copySmartLink = (slug: string, withUtm = false) => {
    const base = `https://lp.justschool.me/s/${slug}`;
    const full = withUtm
      ? `${base}?utm_source=${encodeURIComponent(utmSource)}&utm_medium=${encodeURIComponent(utmMedium)}&utm_campaign=${encodeURIComponent(utmCampaign)}`
      : base;

    navigator.clipboard.writeText(full);
    setCopiedSlug(slug + (withUtm ? "_utm" : ""));
    setTimeout(() => setCopiedSlug(null), 2500);
  };

  // Login Screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-600/20 rounded-full blur-3xl"></div>
          
          <div className="flex flex-col items-center text-center mb-8">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-xl shadow-indigo-600/30 mb-4">
              <Lock className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">JustSchool Splitter</h1>
            <p className="text-xs text-slate-400 mt-1">Вход во внутренний дашборд управления сплитами</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Пароль администратора
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  autoFocus
                  placeholder="••••••••••••"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm font-medium"
                />
                <KeyRound className="w-4 h-4 text-slate-500 absolute right-3.5 top-3.5" />
              </div>
              {authError && (
                <p className="text-xs text-rose-400 font-medium mt-2">{authError}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/25 transition-all text-sm flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" /> Войти в панель
            </button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-[11px] text-slate-500">Доступ только для маркетинговой команды JustSchool</span>
          </div>
        </div>
      </div>
    );
  }

  // High-level Aggregated Stats
  const totalVisits = experiments.reduce(
    (acc, exp) => acc + exp.variants.reduce((vAcc, v) => vAcc + (v.visits || 0), 0),
    0
  );
  const totalLeads = experiments.reduce(
    (acc, exp) => acc + exp.variants.reduce((vAcc, v) => vAcc + (v.leads || 0), 0),
    0
  );
  const totalPaid = experiments.reduce(
    (acc, exp) => acc + exp.variants.reduce((vAcc, v) => vAcc + (v.paid || 0), 0),
    0
  );
  const overallCR = totalVisits > 0 ? ((totalLeads / totalVisits) * 100).toFixed(1) : "0.0";

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navigation */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <Split className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                  JustSchool Smart Splitter
                </span>
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs px-2 py-0.5 rounded-full font-medium">
                  Live Engine
                </span>
              </div>
              <p className="text-xs text-slate-400">Traffic Routing & Conversion Optimization</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === "dashboard"
                  ? "bg-slate-800 text-white shadow-sm border border-slate-700"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              <BarChart3 className="w-4 h-4 inline-block mr-2 -mt-0.5" />
              Дашборд Сплитов
            </button>
            <button
              onClick={() => setActiveTab("create")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === "create"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                  : "bg-indigo-600/90 text-white hover:bg-indigo-500 shadow-md shadow-indigo-600/20"
              }`}
            >
              <Plus className="w-4 h-4" />
              Создать Сплит-Связку
            </button>
            <button
              onClick={handleLogout}
              title="Выйти"
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-all ml-1"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* KPI Overview Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">Всего визитов</span>
              <Users className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-3xl font-extrabold text-white tracking-tight">{totalVisits.toLocaleString()}</div>
            <div className="text-xs text-slate-400 mt-1">Трафик на сплит-ссылках</div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">Лиды (Конверсии)</span>
              <Target className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-extrabold text-emerald-400 tracking-tight">{totalLeads.toLocaleString()}</div>
            <div className="text-xs text-slate-400 mt-1">Заявок в CRM / Creatio</div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">Средний CR в Лид</span>
              <TrendingUp className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-3xl font-extrabold text-cyan-400 tracking-tight">{overallCR}%</div>
            <div className="text-xs text-slate-400 mt-1">Конверсия воронки</div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">Оплаты</span>
              <DollarSign className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-3xl font-extrabold text-amber-400 tracking-tight">{totalPaid}</div>
            <div className="text-xs text-slate-400 mt-1">Подтвержденных покупок</div>
          </div>
        </div>

        {/* TAB 1: CREATE SPLIT LINK */}
        {activeTab === "create" && (
          <div className="max-w-3xl mx-auto bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-indigo-400">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Новый Маркетинговый Сплиттер</h2>
                <p className="text-sm text-slate-400">
                  Создайте смарт-ссылку для автоматического деления трафика между двумя лендингами
                </p>
              </div>
            </div>

            <form onSubmit={handleCreate} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-1">
                  Название эксперимента
                </label>
                <input
                  type="text"
                  required
                  placeholder="Например: English Adult: LP1 vs LP Pains"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-1">
                  Уникальный URL Slug для смарт-ссылки
                </label>
                <div className="flex items-center rounded-xl bg-slate-950 border border-slate-700/80 px-4 py-3 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500">
                  <span className="text-slate-500 text-sm select-none">https://lp.justschool.me/s/</span>
                  <input
                    type="text"
                    required
                    placeholder="eng-adult-test"
                    value={formSlug}
                    onChange={(e) => setFormSlug(e.target.value)}
                    className="w-full bg-transparent border-0 text-white placeholder-slate-600 focus:outline-none p-0 ml-1 text-sm font-medium"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1.5">
                  Трафик будет заходить на эту ссылку и мгновенно распределяться сервером
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                {/* Variant A */}
                <div className="bg-slate-950/60 border border-indigo-500/30 rounded-2xl p-5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 px-3 py-1 bg-indigo-500/20 border-b border-l border-indigo-500/30 text-indigo-400 text-xs font-bold rounded-bl-xl">
                    Вариант A ({weightA}%)
                  </div>
                  <h3 className="font-bold text-white mb-3 text-sm flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                    Лендинг А
                  </h3>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">Выбрать из существующих</label>
                      <select
                        value={variantAUrl}
                        onChange={(e) => {
                          setVariantAUrl(e.target.value);
                          const matched = PRESET_LANDINGS.find((p) => p.url === e.target.value);
                          if (matched) setVariantAName(matched.name);
                        }}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                      >
                        {PRESET_LANDINGS.map((p) => (
                          <option key={p.url} value={p.url}>
                            {p.name} ({p.url})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">Или указать прямой URL</label>
                      <input
                        type="text"
                        value={variantAUrl}
                        onChange={(e) => setVariantAUrl(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Variant B */}
                <div className="bg-slate-950/60 border border-violet-500/30 rounded-2xl p-5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 px-3 py-1 bg-violet-500/20 border-b border-l border-violet-500/30 text-violet-400 text-xs font-bold rounded-bl-xl">
                    Вариант B ({100 - weightA}%)
                  </div>
                  <h3 className="font-bold text-white mb-3 text-sm flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-violet-400"></span>
                    Лендинг B
                  </h3>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">Выбрать из существующих</label>
                      <select
                        value={variantBUrl}
                        onChange={(e) => {
                          setVariantBUrl(e.target.value);
                          const matched = PRESET_LANDINGS.find((p) => p.url === e.target.value);
                          if (matched) setVariantBName(matched.name);
                        }}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                      >
                        {PRESET_LANDINGS.map((p) => (
                          <option key={p.url} value={p.url}>
                            {p.name} ({p.url})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">Или указать прямой URL</label>
                      <input
                        type="text"
                        value={variantBUrl}
                        onChange={(e) => setVariantBUrl(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Weight Slider */}
              <div className="bg-slate-950/40 border border-slate-800 rounded-2xl p-5">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-semibold text-slate-200">
                    Распределение трафика: {weightA}% / {100 - weightA}%
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setWeightA(50)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-xs rounded-lg text-slate-300 font-medium"
                    >
                      50 / 50
                    </button>
                    <button
                      type="button"
                      onClick={() => setWeightA(70)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-xs rounded-lg text-slate-300 font-medium"
                    >
                      70 / 30
                    </button>
                    <button
                      type="button"
                      onClick={() => setWeightA(80)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-xs rounded-lg text-slate-300 font-medium"
                    >
                      80 / 20
                    </button>
                  </div>
                </div>
                <input
                  type="range"
                  min="10"
                  max="90"
                  step="5"
                  value={weightA}
                  onChange={(e) => setWeightA(parseInt(e.target.value, 10))}
                  className="w-full accent-indigo-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setActiveTab("dashboard")}
                  className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? "Создание..." : "Запустить Сплит"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 2: DASHBOARD */}
        {activeTab === "dashboard" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Experiments List */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-400" />
                  Активные Сплит-Тесты ({experiments.length})
                </h2>
                <button
                  onClick={fetchExperiments}
                  className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" /> Обновить
                </button>
              </div>

              {loading ? (
                <div className="p-8 text-center text-slate-500 text-sm">Загрузка экспериментов...</div>
              ) : experiments.length === 0 ? (
                <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-8 text-center">
                  <Split className="w-8 h-8 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400 text-sm font-medium mb-3">Пока нет созданных сплит-тестов</p>
                  <button
                    onClick={() => setActiveTab("create")}
                    className="px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg"
                  >
                    Создать первый сплит
                  </button>
                </div>
              ) : (
                experiments.map((exp) => {
                  const isSelected = selectedExp?.id === exp.id;
                  const expVisits = exp.variants.reduce((s, v) => s + (v.visits || 0), 0);
                  const expLeads = exp.variants.reduce((s, v) => s + (v.leads || 0), 0);
                  const expCR = expVisits > 0 ? ((expLeads / expVisits) * 100).toFixed(1) : "0.0";

                  return (
                    <div
                      key={exp.id}
                      onClick={() => setSelectedExp(exp)}
                      className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                        isSelected
                          ? "bg-slate-900 border-indigo-500/60 shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500/30"
                          : "bg-slate-900/50 border-slate-800/80 hover:bg-slate-900/80 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-2 h-2 rounded-full ${
                                exp.status === "active" ? "bg-emerald-400 animate-pulse" : "bg-slate-500"
                              }`}
                            ></span>
                            <h3 className="font-bold text-sm text-white">{exp.name}</h3>
                          </div>
                          <p className="text-xs text-indigo-400 font-mono mt-0.5">/s/{exp.slug}</p>
                        </div>
                        <span
                          className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                            exp.status === "active"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : "bg-slate-800 text-slate-400"
                          }`}
                        >
                          {exp.status === "active" ? "Активен" : "Пауза"}
                        </span>
                      </div>

                      {/* Mini stats */}
                      <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-800/60 text-center">
                        <div>
                          <div className="text-[10px] text-slate-400 uppercase">Клики</div>
                          <div className="text-xs font-bold text-slate-200">{expVisits}</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-400 uppercase">Лиды</div>
                          <div className="text-xs font-bold text-emerald-400">{expLeads}</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-400 uppercase">CR %</div>
                          <div className="text-xs font-bold text-cyan-400">{expCR}%</div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Right Column: Selected Experiment Deep Dive */}
            <div className="lg:col-span-7 space-y-6">
              {selectedExp ? (
                <>
                  {/* Header card for selected */}
                  <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl backdrop-blur">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h2 className="text-xl font-bold text-white">{selectedExp.name}</h2>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                              selectedExp.status === "active"
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : "bg-slate-800 text-slate-400"
                            }`}
                          >
                            {selectedExp.status === "active" ? "Активен" : "На паузе"}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">
                          Маршрутизатор сплитует трафик между {selectedExp.variants.length} вариантами лендингов
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleStatus(selectedExp)}
                          title={selectedExp.status === "active" ? "Приостановить сплит" : "Возобновить сплит"}
                          className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition-all"
                        >
                          {selectedExp.status === "active" ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleResetStats(selectedExp.id)}
                          title="Сбросить статистику"
                          className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(selectedExp.id)}
                          title="Удалить сплит"
                          className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-xl transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Smart Link Copy Box */}
                    <div className="mt-5 space-y-3">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                        <Link2 className="w-3.5 h-3.5 text-indigo-400" />
                        Ваша Smart Split Ссылка
                      </label>
                      <div className="flex items-center gap-2 bg-slate-950 border border-indigo-500/30 rounded-2xl p-2.5">
                        <span className="text-indigo-400 text-xs sm:text-sm font-mono truncate pl-2 flex-1">
                          https://lp.justschool.me/s/{selectedExp.slug}
                        </span>
                        <a
                          href={`/s/${selectedExp.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-1"
                        >
                          Тест <ExternalLink className="w-3 h-3" />
                        </a>
                        <button
                          onClick={() => copySmartLink(selectedExp.slug, false)}
                          className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition-all"
                        >
                          {copiedSlug === selectedExp.slug ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-white" /> Скопировано!
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" /> Скопировать
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* UTM Tag Generator for Ads */}
                    <div className="mt-5 pt-5 border-t border-slate-800/80">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Генератор для рекламы с UTM метками
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 mb-3">
                        <input
                          type="text"
                          placeholder="utm_source"
                          value={utmSource}
                          onChange={(e) => setUtmSource(e.target.value)}
                          className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                        />
                        <input
                          type="text"
                          placeholder="utm_medium"
                          value={utmMedium}
                          onChange={(e) => setUtmMedium(e.target.value)}
                          className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                        />
                        <input
                          type="text"
                          placeholder="utm_campaign"
                          value={utmCampaign}
                          onChange={(e) => setUtmCampaign(e.target.value)}
                          className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                        />
                      </div>
                      <button
                        onClick={() => copySmartLink(selectedExp.slug, true)}
                        className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-all"
                      >
                        {copiedSlug === selectedExp.slug + "_utm" ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" /> Ссылка с UTM скопирована в буфер!
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-slate-400" /> Скопировать готовую рекламную ссылку с UTM
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Split Comparison Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedExp.variants.map((v, idx) => {
                      const crLead = v.visits > 0 ? ((v.leads / v.visits) * 100).toFixed(1) : "0.0";
                      const crPay = v.leads > 0 ? ((v.paid / v.leads) * 100).toFixed(1) : "0.0";

                      // Winner detection logic
                      const otherVariant = selectedExp.variants[idx === 0 ? 1 : 0];
                      const otherCr =
                        otherVariant && otherVariant.visits > 0
                          ? (otherVariant.leads / otherVariant.visits) * 100
                          : 0;
                      const isWinning = parseFloat(crLead) > otherCr && v.visits >= 20;

                      return (
                        <div
                          key={v.id}
                          className={`bg-slate-900/90 border rounded-3xl p-6 relative overflow-hidden transition-all ${
                            isWinning
                              ? "border-emerald-500/50 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/30"
                              : "border-slate-800"
                          }`}
                        >
                          {isWinning && (
                            <div className="absolute top-0 right-0 px-3 py-1 bg-emerald-500/20 border-b border-l border-emerald-500/30 text-emerald-400 text-xs font-bold rounded-bl-2xl flex items-center gap-1">
                              <Sparkles className="w-3 h-3" /> Лидер по CR
                            </div>
                          )}

                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className={`w-3 h-3 rounded-full ${
                                idx === 0 ? "bg-indigo-400" : "bg-violet-400"
                              }`}
                            ></span>
                            <h3 className="font-bold text-white text-base">{v.name}</h3>
                          </div>
                          <a
                            href={v.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-slate-400 hover:text-indigo-400 font-mono inline-flex items-center gap-1 mb-5"
                          >
                            {v.url} <ExternalLink className="w-2.5 h-2.5" />
                          </a>

                          <div className="space-y-4">
                            {/* Metrics Grid */}
                            <div className="grid grid-cols-3 gap-2 bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80 text-center">
                              <div>
                                <span className="text-[10px] text-slate-400 uppercase">Визиты ({v.weight}%)</span>
                                <div className="text-sm font-extrabold text-white">{v.visits}</div>
                              </div>
                              <div>
                                <span className="text-[10px] text-slate-400 uppercase">Лиды</span>
                                <div className="text-sm font-extrabold text-emerald-400">{v.leads}</div>
                              </div>
                              <div>
                                <span className="text-[10px] text-slate-400 uppercase">Оплаты</span>
                                <div className="text-sm font-extrabold text-amber-400">{v.paid}</div>
                              </div>
                            </div>

                            {/* Conversion Rate Bars */}
                            <div className="space-y-2 pt-2">
                              <div>
                                <div className="flex justify-between text-xs mb-1">
                                  <span className="text-slate-400">CR в Лид:</span>
                                  <span className="font-bold text-emerald-400">{crLead}%</span>
                                </div>
                                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                                  <div
                                    className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                                    style={{ width: `${Math.min(parseFloat(crLead) * 5, 100)}%` }}
                                  ></div>
                                </div>
                              </div>

                              <div>
                                <div className="flex justify-between text-xs mb-1">
                                  <span className="text-slate-400">CR Лид → Оплата:</span>
                                  <span className="font-bold text-amber-400">{crPay}%</span>
                                </div>
                                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                                  <div
                                    className="bg-amber-500 h-2 rounded-full transition-all duration-500"
                                    style={{ width: `${Math.min(parseFloat(crPay) * 5, 100)}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : null}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
