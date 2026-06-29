import { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeButton?: boolean;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  closeButton = true,
}: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        className={`bg-dark-card border border-dark-border rounded-lg shadow-xl ${sizeClasses[size]} w-full`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {(title || closeButton) && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-dark-border">
            {title && <h2 className="text-lg font-semibold text-text-primary">{title}</h2>}
            {closeButton && (
              <button
                onClick={onClose}
                className="ml-auto p-1 hover:bg-dark-border rounded-lg transition-colors text-text-secondary hover:text-text-primary"
              >
                <X size={20} />
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className="px-6 py-4">{children}</div>
      </div>

      {/* Overlay click to close */}
      <div className="fixed inset-0 -z-10" onClick={onClose} />
    </div>
  );
}

interface ModalContentProps {
  children: ReactNode;
}

export function ModalContent({ children }: ModalContentProps) {
  return <div className="space-y-4">{children}</div>;
}

interface ModalFooterProps {
  children: ReactNode;
  align?: 'left' | 'right' | 'center' | 'between';
}

export function ModalFooter({ children, align = 'right' }: ModalFooterProps) {
  const alignClass = {
    left: 'justify-start',
    right: 'justify-end',
    center: 'justify-center',
    between: 'justify-between',
  };

  return (
    <div className={`flex gap-3 mt-6 pt-4 border-t border-dark-border ${alignClass[align]}`}>
      {children}
    </div>
  );
}
