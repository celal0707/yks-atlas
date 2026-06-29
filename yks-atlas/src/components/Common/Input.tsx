import { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
  helperText?: string;
}

export default function Input({
  label,
  error,
  icon,
  helperText,
  className = '',
  ...props
}: InputProps) {
  return (
    <div className="input-group">
      {label && <label className="input-label">{label}</label>}
      <div className="relative">
        {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">{icon}</div>}
        <input
          className={`input ${icon ? 'pl-10' : ''} ${error ? 'border-accent-red focus:ring-accent-red' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-accent-red mt-1">{error}</p>}
      {helperText && !error && <p className="text-xs text-text-muted mt-1">{helperText}</p>}
    </div>
  );
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export function Textarea({
  label,
  error,
  helperText,
  className = '',
  ...props
}: TextareaProps) {
  return (
    <div className="input-group">
      {label && <label className="input-label">{label}</label>}
      <textarea
        className={`input resize-none ${error ? 'border-accent-red focus:ring-accent-red' : ''} ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-accent-red mt-1">{error}</p>}
      {helperText && !error && <p className="text-xs text-text-muted mt-1">{helperText}</p>}
    </div>
  );
}

interface SelectProps extends InputHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  helperText?: string;
}

export function Select({
  label,
  error,
  options,
  helperText,
  className = '',
  ...props
}: SelectProps) {
  return (
    <div className="input-group">
      {label && <label className="input-label">{label}</label>}
      <select
        className={`input ${error ? 'border-accent-red focus:ring-accent-red' : ''} ${className}`}
        {...props}
      >
        <option value="">Seç...</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-accent-red mt-1">{error}</p>}
      {helperText && !error && <p className="text-xs text-text-muted mt-1">{helperText}</p>}
    </div>
  );
}

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Checkbox({ label, className = '', ...props }: CheckboxProps) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        className={`w-4 h-4 rounded border border-dark-border bg-dark-bg checked:bg-primary-500 checked:border-primary-500 cursor-pointer ${className}`}
        {...props}
      />
      {label && <span className="text-sm">{label}</span>}
    </label>
  );
}

interface RadioProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Radio({ label, className = '', ...props }: RadioProps) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="radio"
        className={`w-4 h-4 border border-dark-border bg-dark-bg checked:bg-primary-500 checked:border-primary-500 cursor-pointer ${className}`}
        {...props}
      />
      {label && <span className="text-sm">{label}</span>}
    </label>
  );
}
