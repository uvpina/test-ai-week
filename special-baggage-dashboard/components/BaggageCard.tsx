'use client';

import { Check, AlertTriangle, Minus } from 'lucide-react';
import { motion } from 'framer-motion';
import { LoadingRecord } from '@/lib/api/loading-records';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useSettings } from '@/lib/context/settings-context';

interface BaggageCardProps {
  record: LoadingRecord;
}

export default function BaggageCard({ record }: BaggageCardProps) {
  const { cardsExpandedByDefault, theme } = useSettings();
  // Initialize expansion state from settings but maintain local state for toggling
  const [isExpanded, setIsExpanded] = useState(cardsExpandedByDefault);

  // This effect will run when cardsExpandedByDefault changes
  // and update the expansion state to match the global setting
  useEffect(() => {
    console.log('BaggageCard: cardsExpandedByDefault changed to', cardsExpandedByDefault);
    setIsExpanded(cardsExpandedByDefault);
  }, [cardsExpandedByDefault]);

  // Toggle expansion on click
  const toggleExpand = () => {
    console.log('BaggageCard: toggling expansion from', isExpanded, 'to', !isExpanded);
    setIsExpanded(prev => !prev);
  };

  // Define the baggage type icon
  const getBaggageIcon = () => {
    switch (record.baggageType) {
      case 'pet':
        return (
          <div className="flex justify-center items-center w-20">
            <Image 
              src="/images/pet.svg" 
              alt="Pet icon" 
              width={50} 
              height={50}
              className="text-blue-600" 
            />
          </div>
        );
      case 'wheelchair':
        return (
          <div className="flex justify-center items-center w-20">
            <Image 
              src="/images/wheelchair.png" 
              alt="Wheelchair icon" 
              width={50} 
              height={50}
              className="text-blue-600" 
            />
          </div>
        );
      case 'weapon':
        return (
          <div className="flex justify-center items-center w-20">
            <Image 
              src="/images/weapon.png" 
              alt="Weapon icon" 
              width={50} 
              height={50}
              className="text-blue-600" 
            />
          </div>
        );
      default:
        return null;
    }
  };

  // Define the status badge
  const getStatusBadge = () => {
    if (record.status === 'loaded') {
      return (
        <div className="bg-success-green text-white px-4 py-2 rounded-md flex items-center w-44 justify-center whitespace-nowrap">
          <Check size={20} className="mr-2 stroke-[3]" />
          <span className="font-medium">LOADED</span>
        </div>
      );
    } else {
      // Red when not loaded and passenger has boarded
      // Yellow when not loaded and passenger has not boarded
      const bgColor = record.hasBoarded ? 'bg-alert-red' : 'bg-alert-yellow';
      return (
        <div className={`${bgColor} text-white px-4 py-2 rounded-md flex items-center w-44 justify-center whitespace-nowrap`}>
          {record.hasBoarded ? (
            <div className="bg-white bg-opacity-20 rounded-full p-1 mr-2 flex items-center justify-center">
              <Minus size={16} className="stroke-[3]" />
            </div>
          ) : (
            <AlertTriangle size={20} className="mr-2 stroke-[3]" />
          )}
          <span className="font-medium">NOT LOADED</span>
        </div>
      );
    }
  };

  // Get baggage type text
  const getBaggageTypeText = () => {
    switch (record.baggageType) {
      case 'pet':
        return 'PET';
      case 'wheelchair':
        return 'WHEELCHAIR';
      case 'weapon':
        return 'WEAPON';
      default:
        return '';
    }
  };

  // CSS classes based on theme
  const cardClasses = theme === 'dark' 
    ? 'bg-card-bg text-dark-blue' 
    : 'bg-card-bg text-card-text';

  const expandedContentClasses = theme === 'dark'
    ? 'border-t border-gray-200 px-4 py-3 bg-gray-50'
    : 'border-t border-gray-200 px-4 py-3 bg-white';

  return (
    <motion.div 
      className={`${cardClasses} baggage-card rounded-lg mb-4 overflow-hidden cursor-pointer`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.01, boxShadow: theme === 'light' ? '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' : '' }}
      onClick={toggleExpand}
      style={{
        boxShadow: 'var(--card-shadow)',
        border: theme === 'light' ? '1px solid var(--border-color)' : 'none'
      }}
    >
      {/* Main card content */}
      <div className="p-4 flex items-center">
        <div className="flex-1 flex items-center">
          <div className="text-xl font-bold w-24">{record.flightNumber}</div>
          <div className={`${theme === 'light' ? 'bg-blue-600' : 'bg-dark-blue'} text-white px-4 py-2 rounded-md text-lg font-bold w-16 text-center`}>{record.seat}</div>
          {getBaggageIcon()}
          <div className="text-l font-bold w-36">{record.departureDateTime}</div>
        </div>
        <div>{getStatusBadge()}</div>
      </div>

      {/* Expanded content */}
      {isExpanded && (
        <motion.div 
          className={expandedContentClasses}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex flex-wrap md:flex-nowrap items-center justify-between">
            {/* Passenger Status */}
            <div className="flex-1 flex items-center border-r border-gray-200 pr-4">
              <div className="w-12 flex justify-center">
                <Image 
                  src={record.hasBoarded ? "/images/occupiedseat.png" : "/images/emptyseat.png"} 
                  alt="Seat status" 
                  width={40} 
                  height={40}
                />
              </div>
              <div className="ml-4">
                <div className="text-sm" style={{ color: theme === 'light' ? 'var(--text-secondary)' : 'text-gray-500' }}>Passenger Status</div>
                <div className="font-medium">{record.hasBoarded ? "BOARDED" : "NOT BOARDED"}</div>
              </div>
            </div>

            {/* Flight Stand */}
            <div className="flex-1 flex items-center border-r border-gray-200 px-4">
              <div className="w-12 flex justify-center">
                <Image 
                  src="/images/stand.png"
                  alt="Flight stand" 
                  width={40} 
                  height={40}
                />
              </div>
              <div className="ml-4">
                <div className="text-sm" style={{ color: theme === 'light' ? 'var(--text-secondary)' : 'text-gray-500' }}>Flight Stand</div>
                <div className="font-medium">STAND – {record.flightStand}</div>
              </div>
            </div>

            {/* Bagtag */}
            <div className="flex-1 flex items-center border-r border-gray-200 px-4">
              <div className="w-12 flex justify-center">
                <Image 
                  src="/images/bagtag.png"
                  alt="Bagtag" 
                  width={40} 
                  height={40}
                />
              </div>
              <div className="ml-4">
                <div className="text-sm" style={{ color: theme === 'light' ? 'var(--text-secondary)' : 'text-gray-500' }}>Bagtag</div>
                <div className="font-medium">{record.bagtag}</div>
              </div>
            </div>

            {/* Baggage Type Text */}
            <div className="flex-1 flex items-center pl-4">
              <div className="w-12 flex justify-center">
                <Image 
                  src={`/images/${
                    record.baggageType === 'pet' 
                      ? 'pet.svg' 
                      : record.baggageType === 'wheelchair' 
                        ? 'wheelchair.png' 
                        : 'weapon.png'
                  }`}
                  alt="Baggage type" 
                  width={40} 
                  height={40}
                />
              </div>
              <div className="ml-4">
                <div className="text-sm" style={{ color: theme === 'light' ? 'var(--text-secondary)' : 'text-gray-500' }}>Baggage Type</div>
                <div className="font-medium">{getBaggageTypeText()}</div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
} 