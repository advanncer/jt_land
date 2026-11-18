import * as React from 'react';

export interface TabItem { value: string; label: string }

/**
 * Segmented navigation. `pill` for in-card switching, `underline` for page-level sections.
 * @startingPoint section="Navigation" subtitle="Pill and underline tab bars" viewport="700x180"
 */
export interface TabsProps {
  items?: Array<TabItem | string>;
  value?: string;
  onChange?: (value: string) => void;
  variant?: 'pill' | 'underline';
  style?: React.CSSProperties;
}
export function Tabs(props: TabsProps): JSX.Element;
