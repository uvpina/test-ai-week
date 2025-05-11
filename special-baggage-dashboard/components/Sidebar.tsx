'use client';

import { useState } from 'react';
import { Menu, Plane, User, MessageCircle, Users, Search, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSettings } from '@/lib/context/settings-context';

interface SidebarItemProps {
  icon: ReactNode;
  active?: boolean;
  href?: string;
}

const SidebarItem = ({ icon, active = false, href }: SidebarItemProps) => {
  const { theme } = useSettings();
  
  const content = (
    <motion.div
      className="p-4 flex justify-center items-center cursor-pointer"
      style={{ 
        color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
        backgroundColor: active && theme === 'light' ? 'rgba(0, 0, 0, 0.05)' : 'transparent',
        borderRadius: '8px'
      }}
      whileHover={{ 
        scale: 1.1,
        backgroundColor: theme === 'light' ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.1)'
      }}
      whileTap={{ scale: 0.95 }}
    >
      {icon}
    </motion.div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
};

export default function Sidebar() {
  const pathname = usePathname();
  const { theme } = useSettings();
  
  return (
    <div 
      className="sidebar w-[80px] h-full flex flex-col" 
      style={{ 
        backgroundColor: 'var(--bg-primary)',
        borderRight: '1px solid var(--border-color)',
        boxShadow: theme === 'light' ? '0 4px 6px -1px rgba(0, 0, 0, 0.05)' : 'none'
      }}
    >
      <SidebarItem icon={<Menu size={24} />} active />
      <div className="flex-1 flex flex-col items-center mt-8 space-y-6">
        <SidebarItem 
          icon={<Plane size={24} />} 
          active={pathname === '/'} 
          href="/"
        />
        <SidebarItem 
          icon={<User size={24} />} 
          active={pathname === '/user'} 
          href="/user"
        />
        <SidebarItem 
          icon={<MessageCircle size={24} />} 
          active={pathname === '/messages'} 
          href="/messages"
        />
        <SidebarItem 
          icon={<Users size={24} />} 
          active={pathname === '/users'} 
          href="/users"
        />
        <SidebarItem 
          icon={<Search size={24} />} 
          active={pathname === '/search'} 
          href="/search"
        />
        <SidebarItem 
          icon={<Settings size={24} />} 
          active={pathname === '/settings'} 
          href="/settings"
        />
      </div>
    </div>
  );
} 