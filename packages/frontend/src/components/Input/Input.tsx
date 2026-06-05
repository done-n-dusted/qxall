import type { ChangeEventHandler } from 'react';
import './Input.css';

interface InputProps {
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
  type?: string;
  className?: string;
  label?: string;
}

export function Input({
  value,
  onChange,
  placeholder,
  type = 'text',
  className = '',
  label,
}: InputProps) {
  return (
    <div className={`input-wrapper ${className}`.trim()}>
      {label && <label className="input-label">{label}</label>}
      <input
        className="input-field"
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
}
