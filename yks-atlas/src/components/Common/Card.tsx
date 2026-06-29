import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  clickable?: boolean;
  onClick?: () => void;
}

export default function Card({ children, className = '', clickable = false, onClick }: CardProps) {
  return (
    <div
      className={`card ${clickable ? 'card-hover' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export function CardHeader({ title, subtitle, action }: CardHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4 mb-4 pb-4 border-b border-dark-border">
      <div>
        <h3 className="section-title">{title}</h3>
        {subtitle && <p className="hint">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

interface CardBodyProps {
  children: ReactNode;
  className?: string;
}

export function CardBody({ children, className = '' }: CardBodyProps) {
  return <div className={className}>{children}</div>;
}

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

export function CardFooter({ children, className = '' }: CardFooterProps) {
  return (
    <div className={`mt-6 pt-4 border-t border-dark-border flex gap-3 ${className}`}>
      {children}
    </div>
  );
}
