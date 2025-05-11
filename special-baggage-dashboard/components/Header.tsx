'use client';

import { useSettings } from '@/lib/context/settings-context';

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  const { theme } = useSettings();
  
  return (
    <header 
      className="p-4 flex items-center h-16" 
      style={{ 
        backgroundColor: 'var(--bg-primary)', 
        color: 'var(--text-primary)',
        borderBottom: '1px solid var(--border-color)',
        boxShadow: theme === 'light' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none'
      }}
    >
      <h1 className="text-xl font-bold">{title}</h1>
    </header>
  );
} 