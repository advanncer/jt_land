import * as React from 'react';

export interface SelectOption { value: string; label: string }

/** Dropdown built from a button + floating panel (no native select chrome). */
export interface SelectProps {
  label?: string;
  /** Either `{value,label}` objects or plain strings. */
  options?: Array<SelectOption | string>;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  style?: React.CSSProperties;
}
export function Select(props: SelectProps): JSX.Element;
