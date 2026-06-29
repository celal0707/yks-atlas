import { ReactNode } from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

interface AlertProps {
  type?: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  children: ReactNode;
  closeable?: boolean;
  onClose?: () => void;
}

export default function Alert({
  type = 'info',
  title,
  children,
  closeable = false,
  onClose,
}: AlertProps) {
  const iconMap = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <AlertCircle className="w-5 h-5" />,
    warning: <AlertTriangle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
  };

  const colorMap = {
    success: 'bg-accent-green/10 border-accent-green/30 text-accent-green',
    error: 'bg-accent-red/10 border-accent-red/30 text-accent-red',
    warning: 'bg-accent-orange/10 border-accent-orange/30 text-accent-orange',
    info: 'bg-primary-500/10 border-primary-500/30 text-primary-200',
  };

  return (
    <div className={`border rounded-lg p-4 flex gap-3 items-start ${colorMap[type]}`}>
      <div className="flex-shrink-0 mt-0.5">{iconMap[type]}</div>
      <div className="flex-1">
        {title && <h4 className="font-semibold mb-1">{title}</h4>}
        <div className="text-sm">{children}</div>
      </div>
      {closeable && (
        <button
          onClick={onClose}
          className="flex-shrink-0 opacity-50 hover:opacity-100 transition-opacity"
        >
          ✕
        </button>
      )}
    </div>
  );
}

export function Toast({ type = 'info', children }: Omit<AlertProps, 'closeable' | 'onClose'>) {
  const iconMap = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <AlertCircle className="w-5 h-5" />,
    warning: <AlertTriangle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
  };

  const colorMap = {
    success: 'toast-success',
    error: 'toast-error',
    warning: 'bg-accent-orange/10 border-accent-orange/30 text-accent-orange',
    info: 'toast-info',
  };

  return (
    <div className={`toast ${colorMap[type]}`}>
      <div className="flex-shrink-0">{iconMap[type]}</div>
      <div className="flex-1">{children}</div>
    </div>
  );
}
