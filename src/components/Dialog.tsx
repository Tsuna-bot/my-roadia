import { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';
import IconButton from './IconButton';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
  fullScreen?: boolean;
  className?: string;
}

export default function Dialog({
  open,
  onClose,
  children,
  title,
  maxWidth = 'md',
  fullScreen = false,
  className = ''
}: DialogProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  const maxWidthClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl'
  };

  return (
    <div className="fixed inset-0 z-[1400] flex items-center justify-center p-6 animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Dialog */}
      <div
        className={`
          relative bg-white rounded-xl shadow-2xl
          ${fullScreen ? 'w-full h-full m-0' : `w-full ${maxWidthClasses[maxWidth]} max-h-[90vh]`}
          flex flex-col
          animate-slide-up
          ${className}
        `}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between p-4 md:p-8 border-b-0">
            <h2 className="text-xl font-semibold text-neutral-10">{title}</h2>
            <IconButton onClick={onClose} size="medium">
              <X size={20} />
            </IconButton>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
