import * as React from 'react';

/** Dark 12px SemiBold label on hover. Single line only — use `Dialog` for anything longer. */
export interface TooltipProps {
  content?: React.ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export function Tooltip(props: TooltipProps): JSX.Element;
