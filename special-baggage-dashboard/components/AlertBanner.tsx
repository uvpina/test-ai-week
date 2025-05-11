'use client';

import { Bell } from 'lucide-react';
import { motion } from 'framer-motion';

interface AlertBannerProps {
  message: string;
}

export default function AlertBanner({ message }: AlertBannerProps) {
  return (
    <motion.div
      className="alert-banner p-3 flex items-center justify-center"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Bell size={18} className="mr-2" />
      <span>{message}</span>
    </motion.div>
  );
} 