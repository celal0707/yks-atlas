import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export default function Button({
  children,
  onClick,
  disabled = false,
  loading = false,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  type = 'button',
}: ButtonProps) {
  const baseClass = 'btn';
  const variantClass = `btn-${variant}`;
  const sizeClass = size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : '';
  const fullWidthClass = fullWidth ? 'btn-block' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClass} ${variantClass} ${sizeClass} ${fullWidthClass} ${className} disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {loading ? (
        <>
          <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
          Yükleniyor...
        </>
      ) : (
        children
      )}
    </button>
  );
}

export function ButtonGroup({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`flex gap-3 ${className}`}>{children}</div>;
}
