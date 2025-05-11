'use client';

import { useState } from 'react';
import { Filter, ChevronDown, User, Check, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettings } from '@/lib/context/settings-context';

interface FilterBarProps {
  filters: {
    flightStatus: string;
    passengerType: string;
    baggageStatus: string;
  };
  onFilterChange: (filterType: string, value: string) => void;
}

interface DropdownProps {
  label: string;
  options: string[];
  value: string;
  icon: React.ReactNode;
  onChange: (value: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

function FilterDropdown({ label, options, value, icon, onChange, isOpen, onToggle }: DropdownProps) {
  const { theme } = useSettings();
  
  return (
    <div className="relative">
      <button
        className="filter-button px-4 py-2 rounded-md flex items-center space-x-2"
        style={{ 
          backgroundColor: 'var(--filter-bg)', 
          color: 'var(--text-primary)',
          boxShadow: 'var(--filter-shadow)'
        }}
        onClick={onToggle}
      >
        <span className="mr-2" style={{ color: 'var(--icon-color)' }}>
          {icon}
        </span>
        <span>{value}</span>
        <ChevronDown size={16} className="ml-2" style={{ color: 'var(--icon-color)' }} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="filter-dropdown-menu absolute top-full left-0 mt-1 rounded shadow-lg z-10 w-48"
            style={{ backgroundColor: 'var(--bg-secondary)' }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <ul>
              {options.map((option) => (
                <li
                  key={option}
                  className={`px-4 py-2 cursor-pointer flex items-center hover:bg-opacity-10 ${
                    theme === 'light' ? 'hover:bg-gray-200' : 'hover:bg-gray-700'
                  }`}
                  style={{ color: 'var(--text-primary)' }}
                  onClick={() => {
                    onChange(option);
                    onToggle(); // Close dropdown after selection
                  }}
                >
                  {value === option && <Check size={16} className="mr-2" style={{ color: theme === 'light' ? '#4a5568' : '#fff' }} />}
                  <span>{option}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FilterBar({ filters, onFilterChange }: FilterBarProps) {
  const flightStatusOptions = ['All', 'Boarded', 'Not Boarded'];
  const passengerTypeOptions = ['All', 'Pet', 'Wheelchair', 'Weapon'];
  const baggageStatusOptions = ['All', 'Loaded', 'Not Loaded'];
  const { theme } = useSettings();
  
  // Track which dropdown is currently open (if any)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  
  // Function to toggle a dropdown
  const toggleDropdown = (dropdown: string) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  return (
    <div className="p-4 flex items-center space-x-4" 
      style={{ 
        backgroundColor: 'var(--bg-primary)',
        borderBottom: '1px solid var(--border-color)'
      }}
    >
      <FilterDropdown
        label="Flight Status"
        options={flightStatusOptions}
        value={filters.flightStatus}
        icon={<User size={18} />}
        onChange={(value) => onFilterChange('flightStatus', value)}
        isOpen={openDropdown === 'flightStatus'}
        onToggle={() => toggleDropdown('flightStatus')}
      />
      <FilterDropdown
        label="Passenger Type"
        options={passengerTypeOptions}
        value={filters.passengerType}
        icon={<Briefcase size={18} />}
        onChange={(value) => onFilterChange('passengerType', value)}
        isOpen={openDropdown === 'passengerType'}
        onToggle={() => toggleDropdown('passengerType')}
      />
      <FilterDropdown
        label="Baggage Status"
        options={baggageStatusOptions}
        value={filters.baggageStatus}
        icon={<Check size={18} />}
        onChange={(value) => onFilterChange('baggageStatus', value)}
        isOpen={openDropdown === 'baggageStatus'}
        onToggle={() => toggleDropdown('baggageStatus')}
      />
    </div>
  );
} 