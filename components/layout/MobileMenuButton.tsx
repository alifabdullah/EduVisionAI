'use client';
import { Menu, X } from 'lucide-react';

interface MobileMenuButtonProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function MobileMenuButton({ isOpen, onToggle }: MobileMenuButtonProps) {
  return (
    <button
      onClick={onToggle}
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
      style={{
        display: 'none',
        alignItems: 'center',
        justifyContent: 'center',
        width: 40,
        height: 40,
        borderRadius: 10,
        background: '#EAF3FF',
        border: 'none',
        cursor: 'pointer',
        flexShrink: 0,
        zIndex: 1001,
      }}
      className="mobile-menu-btn"
    >
      {isOpen ? <X size={22} color="#003B95" /> : <Menu size={22} color="#003B95" />}
    </button>
  );
}
