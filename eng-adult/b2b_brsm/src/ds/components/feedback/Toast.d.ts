import * as React from 'react';

/** Transient confirmation banner. Tinted surface + hairline border, never solid ink. */
export interface ToastProps {
  tone?: 'success' | 'warning' | 'danger' | 'info' | 'brand';
  title?: string;
  message?: string;
  icon?: React.ReactNode;
  onDismiss?: () => void;
  style?: React.CSSProperties;
}
export function Toast(props: ToastProps): JSX.Element;
