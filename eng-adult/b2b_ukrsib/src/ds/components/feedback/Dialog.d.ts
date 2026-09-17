import * as React from 'react';

/** Centred modal on a blurred 48% ink scrim. 32px radius, 32px padding. */
export interface DialogProps {
  open?: boolean;
  title?: string;
  description?: string;
  onClose?: () => void;
  /** Action row, right-aligned. Pass `Button`s. */
  footer?: React.ReactNode;
  width?: number;
  children?: React.ReactNode;
}
export function Dialog(props: DialogProps): JSX.Element | null;
