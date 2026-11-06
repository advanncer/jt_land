import * as React from 'react';

/** Square 22px checkbox with a 4px radius; checked fills brand orange. */
export interface CheckboxProps {
  checked?: boolean;
  onChange?: (next: boolean) => void;
  label?: string;
  /** Optional 12px Regular helper line under the label. */
  description?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
}
export function Checkbox(props: CheckboxProps): JSX.Element;
