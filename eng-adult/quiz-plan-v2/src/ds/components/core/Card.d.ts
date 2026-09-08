import * as React from 'react';

/**
 * Container surface. 24px radius, soft neutral shadow, no visible border by default.
 * @startingPoint section="Core" subtitle="Card surfaces: raised, outlined, warm, brand" viewport="700x260"
 */
export interface CardProps {
  variant?: 'raised' | 'outlined' | 'warm' | 'brand' | 'inverse';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  /** Adds the hover lift + deeper shadow and a pointer cursor. */
  interactive?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export function Card(props: CardProps): JSX.Element;
