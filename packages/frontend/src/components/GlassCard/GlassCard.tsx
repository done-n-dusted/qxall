import type { ReactNode } from 'react';
import './GlassCard.css';

interface GlassCardProps {
  children: ReactNode;
  elevated?: boolean;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
}

export function GlassCard({
  children,
  elevated = false,
  className = '',
  padding = 'md',
}: GlassCardProps) {
  const classes = [
    'glass-card',
    elevated ? 'glass-card--elevated' : '',
    `glass-card--padding-${padding}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <div className={classes}>{children}</div>;
}
