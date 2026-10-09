import * as React from 'react';

/** Small status pill: lesson level, "Новий", seat counts, live indicators. */
export interface BadgeProps {
  tone?: 'brand' | 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'solid';
  size?: 'sm' | 'md';
  /** Prepend a 6px dot in the current colour — use for live / status states. */
  dot?: boolean;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export function Badge(props: BadgeProps): JSX.Element;
