import * as React from 'react';

/** Single-line text field. 12px radius, 1.5px border, orange focus ring. */
export interface InputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: 'text' | 'email' | 'tel' | 'password' | 'number' | 'search';
  /** Error text — replaces `hint` and turns the border red-orange. */
  error?: string;
  hint?: string;
  disabled?: boolean;
  required?: boolean;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  /** 40 / 48 / 56px tall. */
  size?: 'sm' | 'md' | 'lg';
  style?: React.CSSProperties;
}
export function Input(props: InputProps): JSX.Element;
