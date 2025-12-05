'use client';

import { ReactNode, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils/cn';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
};

export function Modal({
  isOpen,
  onClose,
  children,
  title,
  size = 'md',
  className,
}: ModalProps) {
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleEscape]);

  if (!isOpen) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal content */}
      <div
        className={cn(
          'relative z-10 w-full rounded-lg bg-white shadow-xl',
          sizeClasses[size],
          className
        )}
      >
        {title && (
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <h2
              id="modal-title"
              className="text-lg font-semibold text-gray-900"
            >
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Cerrar"
            >
              <CloseIcon />
            </button>
          </div>
        )}

        <div className={cn(!title && 'pt-4')}>{children}</div>
      </div>
    </div>
  );

  if (typeof window === 'undefined') return null;

  return createPortal(modalContent, document.body);
}

export function ModalBody({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn('px-6 py-4', className)}>{children}</div>;
}

export function ModalFooter({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex justify-end gap-3 border-t border-gray-200 px-6 py-4',
        className
      )}
    >
      {children}
    </div>
  );
}

function CloseIcon() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
}
