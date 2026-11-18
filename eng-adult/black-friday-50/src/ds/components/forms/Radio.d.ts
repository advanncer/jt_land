import * as React from 'react';

/** Single-choice control. Render a group of these and own the state yourself. */
export interface RadioProps {
  checked?: boolean;
  onChange?: (next: true) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
}
export function Radio(props: RadioProps): JSX.Element;
