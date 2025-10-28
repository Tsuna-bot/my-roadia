import { ReactNode, useEffect, useRef, useState } from 'react';

interface MenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  anchorOrigin?: {
    vertical: 'top' | 'bottom';
    horizontal: 'left' | 'right';
  };
  transformOrigin?: {
    vertical: 'top' | 'bottom';
    horizontal: 'left' | 'right';
  };
  className?: string;
}

export default function Menu({
  anchorEl,
  open,
  onClose,
  children,
  anchorOrigin = { vertical: 'bottom', horizontal: 'right' },
  transformOrigin = { vertical: 'top', horizontal: 'right' },
  className = ''
}: MenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        anchorEl &&
        !anchorEl.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [open, onClose, anchorEl]);

  // Calculate position with bounds checking
  useEffect(() => {
    if (!open || !anchorEl || !menuRef.current) return;

    const rect = anchorEl.getBoundingClientRect();
    const menuWidth = isMobile ? window.innerWidth - 16 : 200; // Full width sur mobile (avec marges de 8px)
    const menuHeight = menuRef.current.offsetHeight || 150; // Estimated height

    let top = rect.bottom;
    let left = 8; // Marge par défaut

    // Sur mobile, menu full-width centré
    if (isMobile) {
      // Full width avec marges de 8px de chaque côté
      left = 8;
    } else {
      // Desktop: comportement original
      left = rect.right;

      // Adjust horizontal position
      if (anchorOrigin.horizontal === 'left') {
        left = rect.left;
      }

      // Check if menu goes beyond right edge
      if (transformOrigin.horizontal === 'right') {
        left = rect.right - menuWidth;
      }

      // Ensure menu doesn't go off-screen on the right
      if (left + menuWidth > window.innerWidth) {
        left = window.innerWidth - menuWidth - 8; // 8px margin
      }

      // Ensure menu doesn't go off-screen on the left
      if (left < 8) {
        left = 8; // 8px margin
      }
    }

    // Adjust vertical position
    if (anchorOrigin.vertical === 'top') {
      top = rect.top;
    }

    // Check if menu goes below viewport
    if (top + menuHeight > window.innerHeight) {
      // Open upward instead
      top = rect.top - menuHeight;
      if (top < 0) {
        top = rect.bottom; // Fallback to original position if not enough space above
      }
    }

    setPosition({ top, left });
  }, [open, anchorEl, anchorOrigin.vertical, anchorOrigin.horizontal, transformOrigin.horizontal]);

  if (!open || !anchorEl) return null;

  return (
    <div
      ref={menuRef}
      className={`
        fixed z-50
        bg-white
        rounded-lg
        shadow-2xl
        shadow-[0_1px_3px_rgba(0,0,0,0.08)]
        py-2
        animate-slide-down
        ${isMobile ? 'left-2 right-2' : 'min-w-[200px]'}
        ${className}
      `}
      style={{
        top: `${position.top}px`,
        ...(isMobile ? {} : { left: `${position.left}px` })
      }}
    >
      {children}
    </div>
  );
}
