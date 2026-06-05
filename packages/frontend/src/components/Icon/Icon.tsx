import type { ReactNode } from 'react';
import './Icon.css';

interface IconProps {
  children: ReactNode;
  size?: number;
  variant?: 'light' | 'dark';
  className?: string;
}

export function Icon({
  children,
  size = 24,
  variant = 'light',
  className = '',
}: IconProps) {
  const classes = [
    'icon',
    `icon--${variant}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span
      className={classes}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      {children}
    </span>
  );
}
