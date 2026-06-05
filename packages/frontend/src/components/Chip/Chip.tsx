import type { ReactNode } from 'react';
import './Chip.css';

interface ChipProps {
  children: ReactNode;
  className?: string;
  active?: boolean;
}

export function Chip({
  children,
  className = '',
  active = false,
}: ChipProps) {
  const classes = [
    'chip',
    active ? 'chip--active' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <span className={classes}>{children}</span>;
}
