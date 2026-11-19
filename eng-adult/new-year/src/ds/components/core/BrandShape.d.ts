import * as React from 'react';

/**
 * Renders one of the four decorative brand elements shipped in `assets/brand/`.
 * Intentional addition: the brand kit supplies these shapes as one flat sheet,
 * so this wrapper exists to place them individually.
 */
export interface BrandShapeProps {
  shape?: 'cross' | 'chevron' | 'rings' | 'burst';
  /** Rendered square size in px. */
  size?: number;
  /** Any CSS colour. The SVGs use `currentColor`, so inline the SVG (not <img>) if you need recolouring. */
  color?: string;
  opacity?: number;
  rotate?: number;
  /** Path prefix to the copied `assets/brand` folder. */
  assetBase?: string;
  style?: React.CSSProperties;
}
export function BrandShape(props: BrandShapeProps): JSX.Element;
