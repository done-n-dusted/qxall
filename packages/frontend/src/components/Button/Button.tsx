import type { ReactNode, MouseEventHandler } from 'react';
import './Button.css';

interface ButtonProps {
  children: ReactNode;
  variant: 'primary' | 'secondary' | 'ghost';
  onClick?: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  className?: string;
  size?: 'sm' | 'md';
}

export function Button({
  children,
  variant,
  onClick,
  disabled = false,
  className = '',
  size = 'md',
}: ButtonProps) {
  const classes = [
    'btn',
    `btn--${variant}`,
    `btn--${size}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      className={classes}
      onClick={onClick}
      disabled={disabled}
      type="button"
    >
      {children}
    </button>
  );
}
