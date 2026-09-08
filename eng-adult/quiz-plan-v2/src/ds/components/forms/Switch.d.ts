import * as React from 'react';

/** Immediate-effect toggle. Knob travel uses `--ease-bounce`. */
export interface SwitchProps {
  checked?: boolean;
  onChange?: (next: boolean) => void;
  label?: string;
  disabled?: boolean;
  size?: 'sm' | 'md';
  style?: React.CSSProperties;
}
export function Switch(props: SwitchProps): JSX.Element;
