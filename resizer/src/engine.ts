import {
  CreativeFormat,
  CreativeItem,
  AdaptationMode,
  PositionAnchor,
  EffectiveConfig,
  RenderFlag,
  WatermarkSetting,
  BadgeSetting,
  ZipStructure,
} from './types';

export const STANDARD_FORMATS: CreativeFormat[] = [
  // Meta (Facebook & Instagram)
  { id: '1x1', w: 1080, h: 1080, ratio: '1:1', name: 'Meta Feed', platform: 'meta', desc: 'Стрічка Instagram & FB' },
  { id: '4x5', w: 1080, h: 1350, ratio: '4:5', name: 'Meta Portrait', platform: 'meta', desc: 'Мобільна стрічка (макс. площа)' },
  { id: '9x16', w: 1080, h: 1920, ratio: '9:16', name: 'Stories & Reels', platform: 'meta', desc: 'Повний екран Stories/Reels' },
  { id: '191x1', w: 1200, h: 628, ratio: '1.91:1', name: 'Meta Link Ad', platform: 'meta', desc: 'Реклама з посиланням у FB' },

  // TikTok
  { id: 'tiktok-9x16', w: 1080, h: 1920, ratio: '9:16', name: 'TikTok Ad', platform: 'tiktok', desc: 'Вертикальний відео-банер TikTok' },

  // Google Display Network (GDN / КМС) - Supports 2x Retina
  { id: 'gdn-300x250', w: 300, h: 250, ratio: '6:5', name: 'Medium Rectangle', platform: 'gdn', desc: 'Найпопулярніший банер GDN (600x500 HD)', isRetinaCapable: true },
  { id: 'gdn-728x90', w: 728, h: 90, ratio: '8:1', name: 'Leaderboard', platform: 'gdn', desc: 'Горизонтальний банер шапки (1456x180 HD)', isRetinaCapable: true },
  { id: 'gdn-160x600', w: 160, h: 600, ratio: '1:3.75', name: 'Wide Skyscraper', platform: 'gdn', desc: 'Вертикальний хмарочос (320x1200 HD)', isRetinaCapable: true },
  { id: 'gdn-320x50', w: 320, h: 50, ratio: '32:5', name: 'Mobile Leaderboard', platform: 'gdn', desc: 'Мобільний банер у додатках (640x100 HD)', isRetinaCapable: true },

  // YouTube
  { id: 'yt-thumb', w: 1280, h: 720, ratio: '16:9', name: 'YouTube Cover', platform: 'youtube', desc: "Прев'ю відео (Thumbnail)" },

  // Telegram & Messengers
  { id: 'tg-post', w: 1080, h: 1080, ratio: '1:1', name: 'Telegram Post', platform: 'messengers', desc: 'Квадратний пост у канал' },
  { id: 'tg-banner', w: 1200, h: 600, ratio: '2:1', name: 'Messenger Banner', platform: 'messengers', desc: 'Широкий банер для розсилок' },
];

export const BRAND_COLORS = [
  { name: 'Emerald', hex: '#1E6B52', label: 'Фірмовий смарагдовий JustSchool' },
  { name: 'Mint', hex: '#00A86B', label: 'Свіжий зелений' },
  { name: 'Coral', hex: '#FF5C35', label: 'Акцентний корал' },
  { name: 'Dark', hex: '#0F172A', label: 'Глибокий темний' },
  { name: 'White', hex: '#FFFFFF', label: 'Чистий білий' },
  { name: 'Studio Gray', hex: '#F1F5F2', label: 'М’який сірий' },
];

export const PROXY_MAX = 1400;
export const THUMB_H = 380;

export const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

export function makeCanvas(w: number, h: number): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = Math.max(1, Math.round(w));
  c.height = Math.max(1, Math.round(h));
  return c;
}

// Multi-step high-quality resampling
export function drawHQ(
  ctx: CanvasRenderingContext2D,
  src: HTMLCanvasElement | HTMLImageElement,
  sx: number, sy: number, sw: number, sh: number,
  dx: number, dy: number, dw: number, dh: number
) {
  dw = Math.max(dw, 1);
  dh = Math.max(dh, 1);
  let cur: HTMLCanvasElement | HTMLImageElement = src;
  let cx = sx, cy = sy, cw = sw, ch = sh;

  while (cw > dw * 2 + 1 || ch > dh * 2 + 1) {
    const nw = cw > dw * 2 + 1 ? Math.max(1, Math.round(cw / 2)) : Math.max(1, Math.round(cw));
    const nh = ch > dh * 2 + 1 ? Math.max(1, Math.round(ch / 2)) : Math.max(1, Math.round(ch));
    const t = makeCanvas(nw, nh);
    const tc = t.getContext('2d');
    if (tc) {
      tc.imageSmoothingEnabled = true;
      tc.imageSmoothingQuality = 'high';
      tc.drawImage(cur, cx, cy, cw, ch, 0, 0, nw, nh);
    }
    if (cur !== src && 'width' in cur) (cur as HTMLCanvasElement).width = 0;
    cur = t;
    cx = 0;
    cy = 0;
    cw = nw;
    ch = nh;
  }

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(cur, cx, cy, cw, ch, dx, dy, dw, dh);
  if (cur !== src && 'width' in cur) (cur as HTMLCanvasElement).width = 0;
}

// Unsharp Mask Filter: sharpens small downscaled text and borders to avoid blurriness
export function applyUnsharpMask(ctx: CanvasRenderingContext2D, w: number, h: number, strength = 0.32) {
  if (w < 4 || h < 4) return;
  try {
    const img = ctx.getImageData(0, 0, w, h);
    const d = img.data;
    const copy = new Uint8ClampedArray(d);

    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        const i = (y * w + x) * 4;
        for (let c = 0; c < 3; c++) {
          const center = copy[i + c];
          const up = copy[((y - 1) * w + x) * 4 + c];
          const down = copy[((y + 1) * w + x) * 4 + c];
          const left = copy[(y * w + (x - 1)) * 4 + c];
          const right = copy[(y * w + (x + 1)) * 4 + c];
          const laplacian = 4 * center - (up + down + left + right);
          d[i + c] = clamp(Math.round(center + laplacian * strength), 0, 255);
        }
      }
    }
    ctx.putImageData(img, 0, 0);
  } catch {}
}

export function makeProxy(img: HTMLImageElement, w: number, h: number): HTMLCanvasElement {
  const s = Math.min(1, PROXY_MAX / Math.max(w, h));
  const c = makeCanvas(w * s, h * s);
  const ctx = c.getContext('2d');
  if (ctx) {
    drawHQ(ctx, img, 0, 0, w, h, 0, 0, c.width, c.height);
  }
  return c;
}

export function detectAlpha(proxy: HTMLCanvasElement): boolean {
  const s = Math.min(1, 384 / Math.max(proxy.width, proxy.height));
  const c = makeCanvas(proxy.width * s, proxy.height * s);
  const ctx = c.getContext('2d', { willReadFrequently: true });
  if (!ctx) return false;
  ctx.drawImage(proxy, 0, 0, c.width, c.height);
  const d = ctx.getImageData(0, 0, c.width, c.height).data;
  for (let i = 3; i < d.length; i += 4) {
    if (d[i] < 250) return true;
  }
  return false;
}

export function edgeColor(proxy: HTMLCanvasElement): string {
  const N = 64;
  const c = makeCanvas(N, N);
  const ctx = c.getContext('2d', { willReadFrequently: true });
  if (!ctx) return '#FFFFFF';
  ctx.drawImage(proxy, 0, 0, N, N);
  const d = ctx.getImageData(0, 0, N, N).data;
  const bins = new Map<number, { n: number; r: number; g: number; b: number }>();
  let opaque = 0, total = 0;

  const take = (x: number, y: number) => {
    const i = (y * N + x) * 4;
    total++;
    if (d[i + 3] < 128) return;
    opaque++;
    const k = ((d[i] >> 4) << 8) | ((d[i + 1] >> 4) << 4) | (d[i + 2] >> 4);
    const b = bins.get(k) || { n: 0, r: 0, g: 0, b: 0 };
    b.n++;
    b.r += d[i];
    b.g += d[i + 1];
    b.b += d[i + 2];
    bins.set(k, b);
  };

  for (let x = 0; x < N; x++) {
    take(x, 0);
    take(x, 1);
    take(x, N - 1);
    take(x, N - 2);
  }
  for (let y = 2; y < N - 2; y++) {
    take(0, y);
    take(1, y);
    take(N - 1, y);
    take(N - 2, y);
  }

  if (opaque < total * 0.25) return '#FFFFFF';
  let best: { n: number; r: number; g: number; b: number } | null = null;
  for (const b of bins.values()) {
    if (!best || b.n > best.n) best = b;
  }
  if (!best) return '#FFFFFF';
  const hx = (v: number) => Math.round(v / best!.n).toString(16).padStart(2, '0');
  return ('#' + hx(best.r) + hx(best.g) + hx(best.b)).toUpperCase();
}

// Smart Subject Saliency detection
export function detectSaliency(proxy: HTMLCanvasElement): { x: number; y: number } {
  const S = 64;
  const c = makeCanvas(S, S);
  const ctx = c.getContext('2d', { willReadFrequently: true });
  if (!ctx) return { x: 0.5, y: 0.5 };
  ctx.drawImage(proxy, 0, 0, S, S);
  const d = ctx.getImageData(0, 0, S, S).data;

  let totalWeight = 0;
  let weightedX = 0;
  let weightedY = 0;

  for (let y = 1; y < S - 1; y++) {
    for (let x = 1; x < S - 1; x++) {
      const idx = (y * S + x) * 4;
      const lum = d[idx] * 0.299 + d[idx + 1] * 0.587 + d[idx + 2] * 0.114;
      const lumRight = d[idx + 4] * 0.299 + d[idx + 5] * 0.587 + d[idx + 6] * 0.114;
      const lumDown = d[idx + S * 4] * 0.299 + d[idx + S * 4 + 1] * 0.587 + d[idx + S * 4 + 2] * 0.114;
      const grad = Math.abs(lumRight - lum) + Math.abs(lumDown - lum);

      const maxC = Math.max(d[idx], d[idx + 1], d[idx + 2]);
      const minC = Math.min(d[idx], d[idx + 1], d[idx + 2]);
      const sat = maxC > 0 ? (maxC - minC) / maxC : 0;

      const weight = grad * 0.7 + sat * 255 * 0.3;
      if (weight > 15) {
        totalWeight += weight;
        weightedX += x * weight;
        weightedY += y * weight;
      }
    }
  }

  if (totalWeight <= 0) return { x: 0.5, y: 0.5 };
  return {
    x: clamp(weightedX / totalWeight / S, 0.1, 0.9),
    y: clamp(weightedY / totalWeight / S, 0.1, 0.9),
  };
}

// PRNG for deterministic texture grain re-synthesis
function mulberry32(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function blurLine(src: Float32Array, N: number, r: number): Float32Array {
  r = Math.max(1, Math.round(r));
  const out = new Float32Array(N * 4);
  const pre = new Float64Array((N + 1) * 4);
  for (let u = 0; u < N; u++) {
    for (let c = 0; c < 4; c++) {
      pre[(u + 1) * 4 + c] = pre[u * 4 + c] + src[u * 4 + c];
    }
  }
  for (let u = 0; u < N; u++) {
    const a = Math.max(0, u - r);
    const b = Math.min(N - 1, u + r);
    const n = b - a + 1;
    for (let c = 0; c < 4; c++) {
      out[u * 4 + c] = (pre[(b + 1) * 4 + c] - pre[a * 4 + c]) / n;
    }
  }
  return out;
}

const smoothLine = (src: Float32Array, N: number, r: number) =>
  blurLine(blurLine(src, N, r / 2 + 0.5), N, r / 2 + 0.5);

const TUNE = { trendMax: 24, flatSpread: 0.05, texSpread: 0.6 };

function extendSide(
  d: Uint8ClampedArray,
  W: number,
  s: { side: string; edge: number; len: number; u0: number; u1: number; depth: number },
  opaque: boolean,
  rnd: () => number
) {
  const N = s.u1 - s.u0;
  const Lf = s.len;
  const D = s.depth;
  if (N < 1 || Lf < 1 || D < 1) return;
  const horiz = s.side === 'top' || s.side === 'bottom';
  const stepU = horiz ? 4 : W * 4;
  const stepO = s.side === 'top' ? W * 4 : s.side === 'bottom' ? -W * 4 : s.side === 'left' ? 4 : -4;
  const base0 = horiz ? (s.edge * W + s.u0) * 4 : (s.u0 * W + s.edge) * 4;
  const idx = (u: number, off: number) => base0 + u * stepU + off * stepO;

  const k = clamp(Math.round(D * 0.012), 1, 8);
  const d1 = Math.max(k + 1, Math.round(D * 0.05));
  const trendOK = 2 * d1 + k <= D;

  const band = (from: number) => {
    const arr = new Float32Array(N * 4);
    for (let u = 0; u < N; u++) {
      let r = 0, g = 0, b = 0, a = 0;
      for (let j = 0; j < k; j++) {
        const p = idx(u, Math.min(D - 1, from + j));
        const al = opaque ? 255 : d[p + 3];
        const m = al / 255;
        r += d[p] * m;
        g += d[p + 1] * m;
        b += d[p + 2] * m;
        a += al;
      }
      arr[u * 4] = r / k;
      arr[u * 4 + 1] = g / k;
      arr[u * 4 + 2] = b / k;
      arr[u * 4 + 3] = a / k;
    }
    return arr;
  };

  const E = band(0);
  let S: Float32Array | null = null;
  if (trendOK) {
    const rb = Math.max(2, N * 0.03);
    const e = smoothLine(E, N, rb);
    const i1 = smoothLine(band(d1), N, rb);
    const i2 = smoothLine(band(2 * d1), N, rb);
    S = new Float32Array(N * 4);
    for (let u = 0; u < N; u++) {
      const q = u * 4;
      const ae = e[q + 3], a1 = i1[q + 3], a2 = i2[q + 3];
      if (ae < 128 || a1 < 128 || a2 < 128) continue;
      for (let c = 0; c < 3; c++) {
        const ve = (e[q + c] * 255) / ae;
        const v1 = (i1[q + c] * 255) / a1;
        const v2 = (i2[q + c] * 255) / a2;
        const s1 = (ve - v1) / d1;
        const s2 = (v1 - v2) / d1;
        const m1 = Math.abs(s1);
        const m2 = Math.abs(s2);
        if (s1 * s2 > 0 && Math.min(m1, m2) >= 0.5 * Math.max(m1, m2)) {
          S[q + c] = Math.sign(s1) * Math.min(m1, m2);
        }
      }
    }
    S = smoothLine(S, N, Math.max(2, N * 0.05));
  }
  const Lg = d1 * 2;

  let texAmp = 0;
  if (opaque && D >= 4) {
    const hist = new Uint32Array(256);
    const rm = Math.max(1, Math.round(N * 0.012));
    let n = 0;
    for (let j = 0; j < Math.min(D, Math.max(3, k)); j++) {
      const row = new Float32Array(N * 4);
      for (let u = 0; u < N; u++) {
        const p = idx(u, j);
        row[u * 4] = d[p];
        row[u * 4 + 1] = d[p + 1];
        row[u * 4 + 2] = d[p + 2];
        row[u * 4 + 3] = 255;
      }
      const sm = smoothLine(row, N, rm);
      for (let u = 0; u < N; u++) {
        const q = u * 4;
        const dv = Math.abs(
          0.3 * (row[q] - sm[q]) + 0.59 * (row[q + 1] - sm[q + 1]) + 0.11 * (row[q + 2] - sm[q + 2])
        );
        hist[Math.min(255, Math.round(dv))]++;
        n++;
      }
    }
    let acc = 0, m = 0;
    for (; m < 256; m++) {
      acc += hist[m];
      if (acc >= n / 2) break;
    }
    texAmp = 1.4826 * m;
  }

  const texW = clamp((texAmp - 1.5) / 2.5, 0, 1);
  const spread = TUNE.flatSpread + (TUNE.texSpread - TUNE.flatSpread) * texW;
  const grain = Math.min(7, texAmp * 0.55) * texW;

  const r0 = Math.max(1, Math.round(N * (0.012 + 0.03 * texW)));
  const radii = [r0];
  const levels = [smoothLine(E, N, r0)];
  while (radii[radii.length - 1] < N) {
    const r = radii[radii.length - 1] * 2;
    radii.push(r);
    levels.push(smoothLine(E, N, r));
  }

  for (let t = 1; t <= Lf; t++) {
    const r = r0 + t * spread;
    let i = 0;
    while (i < radii.length - 1 && radii[i + 1] <= r) i++;
    const j = Math.min(i + 1, radii.length - 1);
    const f = j === i ? 0 : clamp((r - radii[i]) / (radii[j] - radii[i]), 0, 1);
    const A = levels[i];
    const B = levels[j];
    const tr = S ? Lg * (1 - Math.exp(-t / Lg)) : 0;

    for (let u = 0; u < N; u++) {
      const q = u * 4;
      const a = A[q + 3] + (B[q + 3] - A[q + 3]) * f;
      let R = 0, G = 0, Bl = 0;
      if (a > 0.5) {
        const inv = 255 / a;
        R = (A[q] + (B[q] - A[q]) * f) * inv;
        G = (A[q + 1] + (B[q + 1] - A[q + 1]) * f) * inv;
        Bl = (A[q + 2] + (B[q + 2] - A[q + 2]) * f) * inv;
        if (tr && S) {
          const tm = TUNE.trendMax;
          R += clamp(S[q] * tr, -tm, tm);
          G += clamp(S[q + 1] * tr, -tm, tm);
          Bl += clamp(S[q + 2] * tr, -tm, tm);
        }
        if (grain > 0.3) {
          const nz = (rnd() + rnd() + rnd() - 1.5) * grain;
          R += nz;
          G += nz;
          Bl += nz;
        }
      }
      const o = idx(u, -t);
      d[o] = clamp(Math.round(R), 0, 255);
      d[o + 1] = clamp(Math.round(G), 0, 255);
      d[o + 2] = clamp(Math.round(Bl), 0, 255);
      d[o + 3] = opaque ? 255 : clamp(Math.round(a), 0, 255);
    }
  }
}

export function extendFields(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  rect: { x: number; y: number; w: number; h: number },
  opaque: boolean
) {
  const x0 = rect.x, y0 = rect.y, x1 = rect.x + rect.w, y1 = rect.y + rect.h;
  if (x0 < 1 && y0 < 1 && W - x1 < 1 && H - y1 < 1) return;
  const img = ctx.getImageData(0, 0, W, H);
  const d = img.data;
  const rnd = mulberry32(20261124);

  if (x0 >= 1) extendSide(d, W, { side: 'left', edge: x0, len: x0, u0: y0, u1: y1, depth: rect.w }, opaque, rnd);
  if (W - x1 >= 1) extendSide(d, W, { side: 'right', edge: x1 - 1, len: W - x1, u0: y0, u1: y1, depth: rect.w }, opaque, rnd);
  if (y0 >= 1) extendSide(d, W, { side: 'top', edge: y0, len: y0, u0: 0, u1: W, depth: rect.h }, opaque, rnd);
  if (H - y1 >= 1) extendSide(d, W, { side: 'bottom', edge: y1 - 1, len: H - y1, u0: 0, u1: W, depth: rect.h }, opaque, rnd);
  ctx.putImageData(img, 0, 0);
}

// Blur painting with dimming overlay support
export function paintBlur(ctx: CanvasRenderingContext2D, W: number, H: number, item: CreativeItem, dim = 0.25) {
  const src = item.proxy;
  const r = Math.max(2, Math.round(Math.max(W, H) * 0.05));
  const pad = r * 3;
  const s = Math.max((W + 2 * pad) / src.width, (H + 2 * pad) / src.height);
  const dw = src.width * s, dh = src.height * s;

  ctx.save();
  ctx.filter = `blur(${r}px)`;
  ctx.drawImage(src, (W - dw) / 2, (H - dh) / 2, dw, dh);
  ctx.restore();

  if (dim > 0) {
    ctx.fillStyle = `rgba(0, 0, 0, ${dim})`;
    ctx.fillRect(0, 0, W, H);
  }
}

// Layout calculations with Retina multiplier and extreme banner positioning
export function layoutFor(
  item: CreativeItem,
  f: CreativeFormat,
  mode: AdaptationMode,
  pos: PositionAnchor,
  retinaMult = 1
) {
  const sw = item.w, sh = item.h;
  const tw = f.w * retinaMult;
  const th = f.h * retinaMult;
  let src = { x: 0, y: 0, w: sw, h: sh };
  let dst = { x: 0, y: 0, w: tw, h: th };
  let scale = 1, crop = 0, empty = 0, distortion = 0;

  const effectivePos = mode === 'smart_crop' ? item.saliencyCenter : pos;

  if (mode === 'fit') {
    scale = Math.min(tw / sw, th / sh);
    const dw = sw * scale, dh = sh * scale;
    dst = { x: (tw - dw) * pos.x, y: (th - dh) * pos.y, w: dw, h: dh };
    empty = 1 - (dw * dh) / (tw * th);
  } else if (mode === 'fill' || mode === 'smart_crop') {
    scale = Math.max(tw / sw, th / sh);
    const vw = Math.min(sw, tw / scale), vh = Math.min(sh, th / scale);
    src = {
      x: clamp((sw - vw) * effectivePos.x, 0, sw - vw),
      y: clamp((sh - vh) * effectivePos.y, 0, sh - vh),
      w: vw,
      h: vh,
    };
    crop = 1 - (vw * vh) / (sw * sh);
  } else {
    scale = Math.max(tw / sw, th / sh);
    const a = tw / th, b = sw / sh;
    distortion = 1 - Math.min(a, b) / Math.max(a, b);
  }

  return { src, dst, scale, crop, empty, distortion, tw, th };
}

// Watermark and badge rendering
export function renderWatermark(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  wm: WatermarkSetting,
  loadedLogos: { white?: HTMLImageElement; black?: HTMLImageElement; sticker?: HTMLImageElement }
) {
  if (!wm.enabled) return;
  const logo = wm.type === 'black' ? loadedLogos.black : wm.type === 'sticker' ? loadedLogos.sticker : loadedLogos.white;
  if (!logo || !logo.complete || logo.naturalWidth === 0) return;

  const targetW = Math.round(W * wm.scale);
  const targetH = Math.round((targetW / logo.naturalWidth) * logo.naturalHeight);
  const margin = Math.round(Math.max(W, H) * 0.04);

  let x = margin;
  let y = margin;
  if (wm.position === 'top-right') x = W - targetW - margin;
  else if (wm.position === 'bottom-left') y = H - targetH - margin;
  else if (wm.position === 'bottom-right') {
    x = W - targetW - margin;
    y = H - targetH - margin;
  }

  ctx.save();
  ctx.globalAlpha = wm.opacity;
  ctx.drawImage(logo, x, y, targetW, targetH);
  ctx.restore();
}

export function renderBadge(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  badge: BadgeSetting
) {
  if (!badge.enabled || !badge.text.trim()) return;

  ctx.save();
  const fontSize = Math.max(14, Math.round(Math.min(W, H) * 0.035));
  ctx.font = `bold ${fontSize}px system-ui, sans-serif`;
  const textMetrics = ctx.measureText(badge.text);
  const padX = fontSize * 0.9;
  const padY = fontSize * 0.55;
  const bw = textMetrics.width + padX * 2;
  const bh = fontSize + padY * 2;
  const margin = Math.round(Math.max(W, H) * 0.04);

  let bx = margin;
  let by = margin;
  if (badge.position === 'top-right') bx = W - bw - margin;
  else if (badge.position === 'bottom-left') by = H - bh - margin;
  else if (badge.position === 'bottom-right') {
    bx = W - bw - margin;
    by = H - bh - margin;
  }

  ctx.fillStyle = badge.theme === 'coral' ? '#FF5C35' : badge.theme === 'yellow' ? '#EAB308' : badge.theme === 'dark' ? '#0F172A' : '#1E6B52';
  ctx.beginPath();
  const radius = bh / 2;
  ctx.roundRect(bx, by, bw, bh, radius);
  ctx.fill();

  ctx.shadowColor = 'rgba(0,0,0,0.25)';
  ctx.shadowBlur = 8;

  ctx.fillStyle = '#FFFFFF';
  ctx.textBaseline = 'middle';
  ctx.fillText(badge.text, bx + padX, by + bh / 2);
  ctx.restore();
}

// Master rendering function with Retina 2x & Unsharp Sharpening
export function renderInto(
  canvas: HTMLCanvasElement,
  item: CreativeItem,
  f: CreativeFormat,
  cfg: EffectiveConfig,
  s: number,
  useProxy: boolean,
  watermark?: WatermarkSetting,
  badge?: BadgeSetting,
  loadedLogos?: { white?: HTMLImageElement; black?: HTMLImageElement; sticker?: HTMLImageElement }
) {
  const retinaMult = (cfg.retinaGDN !== false && f.isRetinaCapable && !useProxy) ? 2 : 1;
  const W = Math.max(1, Math.round(f.w * retinaMult * s));
  const H = Math.max(1, Math.round(f.h * retinaMult * s));
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.clearRect(0, 0, W, H);
  const bg = cfg.bg;
  const continueBg = cfg.mode === 'fit' && bg.kind === 'extend';

  if (!continueBg) {
    if (cfg.outType === 'jpg') {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, W, H);
    }
    if (bg.kind === 'color' || bg.kind === 'auto') {
      ctx.fillStyle = bg.kind === 'auto' ? item.edgeColor : bg.color;
      ctx.fillRect(0, 0, W, H);
    } else if (bg.kind === 'blur') {
      paintBlur(ctx, W, H, item, bg.blurDim ?? 0.25);
    }
  }

  const L = layoutFor(item, f, cfg.mode, cfg.pos, retinaMult);
  const source = useProxy ? item.proxy : item.img;
  const kx = useProxy ? item.proxy.width / item.w : 1;
  const ky = useProxy ? item.proxy.height / item.h : 1;

  let dx = L.dst.x * s, dy = L.dst.y * s, dw = L.dst.w * s, dh = L.dst.h * s;
  if (cfg.mode !== 'fit') {
    dx = 0; dy = 0; dw = W; dh = H;
  } else {
    const x2 = clamp(Math.round(dx + dw), 1, W);
    const y2 = clamp(Math.round(dy + dh), 1, H);
    dx = clamp(Math.round(dx), 0, x2 - 1);
    dy = clamp(Math.round(dy), 0, y2 - 1);
    dw = x2 - dx;
    dh = y2 - dy;
  }

  drawHQ(ctx, source, L.src.x * kx, L.src.y * ky, L.src.w * kx, L.src.h * ky, dx, dy, dw, dh);

  if (continueBg) {
    extendFields(ctx, W, H, { x: dx, y: dy, w: dw, h: dh }, !item.hasAlpha);
    if (cfg.outType === 'jpg') {
      ctx.save();
      ctx.globalCompositeOperation = 'destination-over';
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, W, H);
      ctx.restore();
    }
  }

  // Watermark overlay
  if (watermark && loadedLogos) {
    renderWatermark(ctx, W, H, watermark, loadedLogos);
  }

  // Badge overlay
  if (badge) {
    renderBadge(ctx, W, H, badge);
  }

  // Apply Unsharp Masking filter on small banners or high downscaling to keep text crisp!
  if (f.h <= 120 || f.w <= 250 || L.scale < 0.45) {
    applyUnsharpMask(ctx, W, H, 0.35);
  }
}

export function renderFull(
  item: CreativeItem,
  f: CreativeFormat,
  cfg: EffectiveConfig,
  watermark?: WatermarkSetting,
  badge?: BadgeSetting,
  loadedLogos?: { white?: HTMLImageElement; black?: HTMLImageElement; sticker?: HTMLImageElement }
): HTMLCanvasElement {
  const c = makeCanvas(1, 1);
  renderInto(c, item, f, cfg, 1, false, watermark, badge, loadedLogos);
  return c;
}

export function encode(canvas: HTMLCanvasElement, type: 'png' | 'jpg' | 'webp', quality: number): Promise<Blob> {
  const mime = type === 'jpg' ? 'image/jpeg' : type === 'webp' ? 'image/webp' : 'image/png';
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error('Encode failed'))),
      mime,
      quality / 100
    );
  });
}

// Flags calculation with UX Safety Guard indicators
export function flagsFor(item: CreativeItem, f: CreativeFormat, cfg: EffectiveConfig): RenderFlag[] {
  const retinaMult = (cfg.retinaGDN !== false && f.isRetinaCapable) ? 2 : 1;
  const L = layoutFor(item, f, cfg.mode, cfg.pos, retinaMult);
  const out: RenderFlag[] = [];

  // UX Guard: Warning if crop will cut critical text/graphics (> 15%)
  if ((cfg.mode === 'fill' || cfg.mode === 'smart_crop') && L.crop > 0.15) {
    out.push({
      cls: 'bad',
      text: `⚠️ Зрізано ${(L.crop * 100).toFixed(0)}% (ризик тексту)`,
      title: 'Критична обрізка: заголовок чи кнопки на краях будуть зрізані! Рекомендується Fit + Продовжити фон',
    });
  } else if ((cfg.mode === 'fill' || cfg.mode === 'smart_crop') && L.crop > 0.005) {
    out.push({
      cls: '',
      text: `Обрізано ${(L.crop * 100).toFixed(0)}%`,
      title: 'Частина оригіналу за межами кадру',
    });
  }

  if (cfg.mode === 'stretch' && L.distortion > 0.01) {
    out.push({
      cls: L.distortion > 0.15 ? 'bad' : 'warn',
      text: `Спотворено ${(L.distortion * 100).toFixed(0)}%`,
      title: 'Зміна природних пропорцій креативу',
    });
  }

  if (cfg.mode === 'fit' && L.empty > 0.65) {
    out.push({
      cls: 'warn',
      text: `⚠️ Дрібний текст (поля ${(L.empty * 100).toFixed(0)}%)`,
      title: 'Вузький банер: макет сильно зменшено. Рекомендовано експортувати 2x Retina HD або кастомізувати розміщення',
    });
  } else if (cfg.mode === 'fit' && L.empty > 0.005) {
    out.push(
      cfg.bg.kind === 'extend'
        ? { cls: '', text: `Добудовано ${(L.empty * 100).toFixed(0)}%`, title: 'Штучно добудовані поля від країв' }
        : { cls: '', text: `Поля ${(L.empty * 100).toFixed(0)}%`, title: 'Вільні області кадру' }
    );
  }

  if (L.scale > 1.05) {
    out.push({
      cls: 'warn',
      text: `Збільшено ×${L.scale.toFixed(1)}`,
      title: 'Оригінал менший за роздільну здатність формату',
    });
  }

  if (cfg.retinaGDN !== false && f.isRetinaCapable) {
    out.push({
      cls: 'own',
      text: '2x HD',
      title: `Google Ads 2x Retina: експортується у високій чіткості ${f.w * 2}×${f.h * 2} px`,
    });
  }

  if (cfg.mode === 'smart_crop' && L.crop <= 0.15) {
    out.push({
      cls: 'own',
      text: 'AI Focus',
      title: 'Автоматичне центрування на головному об’єкті',
    });
  }

  if (cfg.own) {
    out.push({
      cls: 'own',
      text: 'Кастом',
      title: 'Індивідуальні налаштування для цього формату',
    });
  }

  return out;
}

export function sanitizeBase(name: string): string {
  const base = String(name)
    .replace(/\.[^.]+$/, '')
    .normalize('NFC')
    .replace(/[\\/:*?"<>|\u0000-\u001F]+/g, '-')
    .replace(/\s+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^[-.]+|[-.]+$/g, '')
    .slice(0, 80);
  return base || 'creative';
}

export function generateFileName(
  item: CreativeItem,
  f: CreativeFormat,
  cfg: EffectiveConfig,
  namingMode = false,
  zipStructure: ZipStructure = 'flat'
): string {
  const ext = cfg.outType === 'jpg' ? 'jpg' : cfg.outType === 'webp' ? 'webp' : 'png';
  const retinaMult = (cfg.retinaGDN !== false && f.isRetinaCapable) ? 2 : 1;
  const w = f.w * retinaMult;
  const h = f.h * retinaMult;
  const hdSuffix = retinaMult > 1 ? '_2xHD' : '';
  const fileName = `${item.base}_${w}x${h}${hdSuffix}${namingMode ? '_' + cfg.mode : ''}.${ext}`;

  if (zipStructure === 'by_format') {
    return `${f.ratio.replace(':', 'x')}_${w}x${h}/${fileName}`;
  } else if (zipStructure === 'by_creative') {
    return `${item.base}/${fileName}`;
  }
  return fileName;
}

// Minimal Pure JS ZIP Builder supporting directories & Cyrillic (Unicode 0x7075)
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

export function crc32(u8: Uint8Array): number {
  let c = 0xffffffff;
  for (let i = 0; i < u8.length; i++) c = CRC_TABLE[(c ^ u8[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

export function buildZip(files: { name: string; data: Uint8Array }[]): Blob {
  const enc = new TextEncoder();
  const parts: ArrayBuffer[] = [];
  const central: ArrayBuffer[] = [];
  const d = new Date();
  const time = (d.getHours() << 11) | (d.getMinutes() << 5) | Math.floor(d.getSeconds() / 2);
  const date = ((d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate();
  let offset = 0;

  for (const f of files) {
    const name = enc.encode(f.name);
    const size = f.data.length;
    const crc = crc32(f.data);

    const extra = new Uint8Array(9 + name.length);
    const ev = new DataView(extra.buffer);
    ev.setUint16(0, 0x7075, true);
    ev.setUint16(2, 5 + name.length, true);
    ev.setUint8(4, 1);
    ev.setUint32(5, crc32(name), true);
    extra.set(name, 9);

    const lh = new DataView(new ArrayBuffer(30));
    lh.setUint32(0, 0x04034b50, true);
    lh.setUint16(4, 20, true);
    lh.setUint16(6, 0x0800, true);
    lh.setUint16(8, 0, true);
    lh.setUint16(10, time, true);
    lh.setUint16(12, date, true);
    lh.setUint32(14, crc, true);
    lh.setUint32(18, size, true);
    lh.setUint32(22, size, true);
    lh.setUint16(26, name.length, true);
    lh.setUint16(28, extra.length, true);

    parts.push(lh.buffer, name.buffer, extra.buffer, f.data.buffer);

    const ch = new DataView(new ArrayBuffer(46));
    ch.setUint32(0, 0x02014b50, true);
    ch.setUint16(4, 0x0314, true);
    ch.setUint16(6, 20, true);
    ch.setUint16(8, 0x0800, true);
    ch.setUint16(10, 0, true);
    ch.setUint16(12, time, true);
    ch.setUint16(14, date, true);
    ch.setUint32(16, crc, true);
    ch.setUint32(20, size, true);
    ch.setUint32(24, size, true);
    ch.setUint16(28, name.length, true);
    ch.setUint16(30, extra.length, true);
    ch.setUint16(32, 0, true);
    ch.setUint16(34, 0, true);
    ch.setUint16(36, 0, true);
    ch.setUint32(38, (0o100644 << 16) >>> 0, true);
    ch.setUint32(42, offset, true);

    central.push(ch.buffer, name.buffer, extra.buffer);
    offset += 30 + name.length + extra.length + size;
  }

  const cdSize = central.reduce((a, b) => a + b.byteLength, 0);
  const end = new DataView(new ArrayBuffer(22));
  end.setUint32(0, 0x06054b50, true);
  end.setUint16(8, files.length, true);
  end.setUint16(10, files.length, true);
  end.setUint32(12, cdSize, true);
  end.setUint32(16, offset, true);

  return new Blob([...parts, ...central, end.buffer], { type: 'application/zip' });
}
