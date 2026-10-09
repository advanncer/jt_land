import * as React from 'react';

/**
 * Primary call-to-action control. Always a pill; label is Montserrat Bold.
 * @startingPoint section="Core" subtitle="Pill buttons in every variant and size" viewport="700x220"
 */
export interface ButtonProps {
  /** Visual weight. `primary` orange fill, `secondary` outlined, `ghost` text-only, `inverse` white-on-orange. */
  variant?: 'primary' | 'secondary' | 'ghost' | 'inverse';
  /** 36 / 44 / 56px tall. */
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export function Button(props: ButtonProps): JSX.Element;
