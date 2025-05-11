'use client';

import { LoadingRecord } from '@/lib/api/loading-records';
import BaggageCard from './BaggageCard';
import { useSettings } from '@/lib/context/settings-context';
import { useEffect, useState } from 'react';

interface BaggageCardListProps {
  records: LoadingRecord[];
}

export default function BaggageCardList({ records }: BaggageCardListProps) {
  const { theme, cardsExpandedByDefault } = useSettings();
  // Add a key to force remounting when settings change
  const [forceUpdateKey, setForceUpdateKey] = useState(0);
  
  // Force re-render when important settings change
  useEffect(() => {
    console.log('BaggageCardList: cardsExpandedByDefault changed to', cardsExpandedByDefault);
    setForceUpdateKey(prev => prev + 1);
  }, [cardsExpandedByDefault, theme]);
  
  if (records.length === 0) {
    return (
      <div 
        className="text-center py-10 mx-auto max-w-md rounded-lg mt-8" 
        style={{ 
          color: 'var(--text-secondary)',
          backgroundColor: theme === 'light' ? 'var(--bg-secondary)' : 'transparent',
          border: theme === 'light' ? '1px solid var(--border-color)' : 'none',
          boxShadow: theme === 'light' ? 'var(--card-shadow)' : 'none'
        }}
      >
        No records found matching your filters.
      </div>
    );
  }

  return (
    <div className="space-y-4" key={forceUpdateKey}>
      {records.map((record, index) => (
        <BaggageCard 
          key={`${record.flightNumber}-${record.seat}-${record.baggageType}-${index}`} 
          record={record} 
        />
      ))}
    </div>
  );
} 