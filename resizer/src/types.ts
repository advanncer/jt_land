export type PlatformCategory = 'all' | 'meta' | 'tiktok' | 'gdn' | 'youtube' | 'messengers' | 'custom';

export interface CreativeFormat {
  id: string;
  w: number;
  h: number;
  ratio: string;
  name: string;
  platform: PlatformCategory;
  desc: string;
}

export type AdaptationMode = 'fit' | 'fill' | 'stretch' | 'smart_crop';

export interface PositionAnchor {
  x: number;
  y: number;
}

export type BackgroundKind = 'extend' | 'blur' | 'color' | 'auto' | 'transparent';

export interface BackgroundSetting {
  kind: BackgroundKind;
  color: string;
  blurRadius?: number;
  blurDim?: number; // 0 to 0.7 dimming overlay
}

export type WatermarkPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export interface WatermarkSetting {
  enabled: boolean;
  type: 'white' | 'black' | 'sticker';
  position: WatermarkPosition;
  scale: number; // 0.15 to 0.35
  opacity: number; // 0.2 to 1.0
}

export interface BadgeSetting {
  enabled: boolean;
  text: string;
  position: WatermarkPosition;
  theme: 'emerald' | 'coral' | 'yellow' | 'dark';
}

export type OutputFormat = 'original' | 'png' | 'jpg' | 'webp';
export type ZipStructure = 'flat' | 'by_format' | 'by_creative';

export interface CreativeItem {
  id: number;
  file: File;
  name: string;
  base: string;
  type: 'png' | 'jpg' | 'webp';
  w: number;
  h: number;
  size: number;
  img: HTMLImageElement;
  url: string;
  proxy: HTMLCanvasElement;
  hasAlpha: boolean;
  edgeColor: string;
  saliencyCenter: { x: number; y: number };
}

export interface FormatOverride {
  mode?: AdaptationMode;
  pos?: PositionAnchor;
  bg?: BackgroundSetting;
}

export interface EffectiveConfig {
  mode: AdaptationMode;
  pos: PositionAnchor;
  bg: BackgroundSetting;
  outType: 'png' | 'jpg' | 'webp';
  quality: number;
  own: boolean;
}

export interface RenderFlag {
  cls: '' | 'warn' | 'bad' | 'own';
  text: string;
  title: string;
}

export type SafeZoneType = 'off' | 'stories' | 'reels' | 'tiktok';
