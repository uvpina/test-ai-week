'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { useSettings } from '@/lib/context/settings-context';
import { Save, Undo2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SettingsPage() {
  const {
    theme,
    lookupTimeRangePast,
    lookupTimeRangeFuture,
    cardsExpandedByDefault,
    setTheme,
    setLookupTimeRangePast,
    setLookupTimeRangeFuture,
    setCardsExpandedByDefault
  } = useSettings();

  // Local state for form inputs
  const [pastHours, setPastHours] = useState(lookupTimeRangePast.toString());
  const [futureHours, setFutureHours] = useState(lookupTimeRangeFuture.toString());
  const [saveMessage, setSaveMessage] = useState('');

  // Keep local state in sync with context values
  useEffect(() => {
    setPastHours(lookupTimeRangePast.toString());
    setFutureHours(lookupTimeRangeFuture.toString());
  }, [lookupTimeRangePast, lookupTimeRangeFuture]);

  // Form validation
  const isPastHoursValid = !isNaN(Number(pastHours)) && Number(pastHours) > 0;
  const isFutureHoursValid = !isNaN(Number(futureHours)) && Number(futureHours) > 0;
  const isFormValid = isPastHoursValid && isFutureHoursValid;

  const handleSave = () => {
    if (!isFormValid) return;
    
    setLookupTimeRangePast(Number(pastHours));
    setLookupTimeRangeFuture(Number(futureHours));
    
    setSaveMessage('Settings saved successfully!');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const handleThemeChange = (newTheme: 'dark' | 'light') => {
    setTheme(newTheme);
    setSaveMessage('Theme updated!');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const handleCardExpansionChange = (expanded: boolean) => {
    setCardsExpandedByDefault(expanded);
    setSaveMessage('Card display setting updated!');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const resetForm = () => {
    // Reset form input fields
    setPastHours(lookupTimeRangePast.toString());
    setFutureHours(lookupTimeRangeFuture.toString());
    setSaveMessage('');
    
    // Reset all settings to defaults
    setTheme('dark');
    setLookupTimeRangePast(24);
    setLookupTimeRangeFuture(24);
    setCardsExpandedByDefault(false);
    
    // Show confirmation message
    setSaveMessage('Settings reset to defaults');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header title="SETTINGS" />
        <main className="flex-1 p-6 overflow-auto" style={{ backgroundColor: 'var(--bg-primary)' }}>
          <div className="max-w-2xl mx-auto">
            {saveMessage && (
              <motion.div 
                className="bg-success-green p-4 rounded-md mb-6 text-white"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                {saveMessage}
              </motion.div>
            )}
            
            {/* Lookup Time Range Section */}
            <div className="settings-section p-6 rounded-lg mb-6" style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Lookup Time Range</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="pastHours" className="block mb-2 font-medium" style={{ color: 'var(--text-primary)' }}>
                    FROM (hours ago)
                  </label>
                  <input
                    type="number"
                    id="pastHours"
                    value={pastHours}
                    onChange={(e) => setPastHours(e.target.value)}
                    min="1"
                    className={`w-full px-4 py-2 rounded-md ${theme === 'light' ? 'bg-white border-gray-300' : 'bg-gray-700 border-gray-600'} text-${theme === 'light' ? 'gray-900' : 'white'} border ${
                      !isPastHoursValid && pastHours ? 'border-alert-red' : 'border-gray-300'
                    }`}
                    style={{ boxShadow: theme === 'light' ? 'inset 0 1px 2px rgba(0,0,0,0.05)' : 'none' }}
                  />
                  {!isPastHoursValid && pastHours && (
                    <p className="text-alert-red text-sm mt-1">Please enter a valid positive number</p>
                  )}
                </div>
                <div>
                  <label htmlFor="futureHours" className="block mb-2 font-medium" style={{ color: 'var(--text-primary)' }}>
                    TO (hours in advance)
                  </label>
                  <input
                    type="number"
                    id="futureHours"
                    value={futureHours}
                    onChange={(e) => setFutureHours(e.target.value)}
                    min="1"
                    className={`w-full px-4 py-2 rounded-md ${theme === 'light' ? 'bg-white border-gray-300' : 'bg-gray-700 border-gray-600'} text-${theme === 'light' ? 'gray-900' : 'white'} border ${
                      !isFutureHoursValid && futureHours ? 'border-alert-red' : 'border-gray-300'
                    }`}
                    style={{ boxShadow: theme === 'light' ? 'inset 0 1px 2px rgba(0,0,0,0.05)' : 'none' }}
                  />
                  {!isFutureHoursValid && futureHours && (
                    <p className="text-alert-red text-sm mt-1">Please enter a valid positive number</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Theme Section */}
            <div className="settings-section p-6 rounded-lg mb-6" style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Theme</h2>
              <div className="flex space-x-4">
                <button
                  onClick={() => handleThemeChange('dark')}
                  className={`px-6 py-3 rounded-md flex items-center justify-center ${
                    theme === 'dark' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                  style={{ boxShadow: theme === 'light' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none' }}
                >
                  Dark Mode
                </button>
                <button
                  onClick={() => handleThemeChange('light')}
                  className={`px-6 py-3 rounded-md flex items-center justify-center ${
                    theme === 'light' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                  style={{ boxShadow: theme === 'light' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none' }}
                >
                  Light Mode
                </button>
              </div>
            </div>
            
            {/* Card Display Section */}
            <div className="settings-section p-6 rounded-lg mb-6" style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Cards Display</h2>
              <div className="flex space-x-4">
                <button
                  onClick={() => handleCardExpansionChange(false)}
                  className={`px-6 py-3 rounded-md flex items-center justify-center ${
                    !cardsExpandedByDefault 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                  style={{ boxShadow: theme === 'light' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none' }}
                >
                  Collapsed by Default
                </button>
                <button
                  onClick={() => handleCardExpansionChange(true)}
                  className={`px-6 py-3 rounded-md flex items-center justify-center ${
                    cardsExpandedByDefault 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                  style={{ boxShadow: theme === 'light' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none' }}
                >
                  Expanded by Default
                </button>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex justify-end space-x-4">
              <button
                onClick={resetForm}
                className={`px-6 py-3 rounded-md flex items-center ${
                  theme === 'light' 
                    ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' 
                    : 'bg-gray-700 text-white hover:bg-gray-600'
                }`}
                style={{ boxShadow: theme === 'light' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none' }}
              >
                <Undo2 size={18} className="mr-2" />
                Reset
              </button>
              <button
                onClick={handleSave}
                disabled={!isFormValid}
                className={`px-6 py-3 rounded-md flex items-center ${
                  isFormValid 
                    ? 'bg-success-green text-white hover:bg-green-600' 
                    : 'bg-gray-500 text-gray-300 cursor-not-allowed'
                }`}
                style={{ 
                  boxShadow: theme === 'light' && isFormValid ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
                  opacity: isFormValid ? 1 : 0.7
                }}
              >
                <Save size={18} className="mr-2" />
                Save Changes
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 