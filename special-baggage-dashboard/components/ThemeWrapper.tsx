'use client';

import { ReactNode, useEffect } from 'react';
import { useSettings } from '@/lib/context/settings-context';

export default function ThemeWrapper({ children }: { children: ReactNode }) {
  const { theme } = useSettings();
  
  // Apply theme class whenever theme changes and on mount
  useEffect(() => {
    console.log('Theme changed to:', theme); // Debug log
    
    // Remove any existing theme classes
    document.body.classList.remove('dark-theme', 'light-theme');
    
    // Add the current theme class
    document.body.classList.add(`${theme}-theme`);
    
    // Add/remove data-theme attribute for potential third-party components that use it
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  
  return <>{children}</>;
} 