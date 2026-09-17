import * as React from 'react';

/** Filter / interest chip. Selectable and optionally removable. */
export interface TagProps {
  selected?: boolean;
  removable?: boolean;
  onClick?: () => void;
  onRemove?: () => void;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export function Tag(props: TagProps): JSX.Element;
