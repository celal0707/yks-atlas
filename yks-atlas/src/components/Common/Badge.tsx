import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'gray';
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
  className?: string;
}

export default function Badge({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  className = '',
}: BadgeProps) {
  const variantClass = `badge-${variant}`;
  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-xs' : size === 'lg' ? 'px-3 py-1.5' : 'px-2.5 py-1 text-xs';

  return (
    <span className={`badge ${variantClass} ${sizeClass} ${className}`}>
      {icon && <span className="mr-1">{icon}</span>}
      {children}
    </span>
  );
}
