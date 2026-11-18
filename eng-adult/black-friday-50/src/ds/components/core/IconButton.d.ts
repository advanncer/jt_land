import * as React from 'react';

/** Circular icon-only button. Always pass `label` for screen readers. */
export interface IconButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  /** 32 / 40 / 48px diameter. */
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  /** Accessible name — required, since there is no visible text. */
  label: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export function IconButton(props: IconButtonProps): JSX.Element;
