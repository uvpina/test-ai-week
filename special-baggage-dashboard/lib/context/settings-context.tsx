'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface SettingsContextType {
  theme: 'dark' | 'light';
  lookupTimeRangePast: number;
  lookupTimeRangeFuture: number;
  cardsExpandedByDefault: boolean;
  setTheme: (theme: 'dark' | 'light') => void;
  setLookupTimeRangePast: (hours: number) => void;
  setLookupTimeRangeFuture: (hours: number) => void;
  setCardsExpandedByDefault: (expanded: boolean) => void;
}

const defaultSettings: Omit<SettingsContextType, 'setTheme' | 'setLookupTimeRangePast' | 'setLookupTimeRangeFuture' | 'setCardsExpandedByDefault'> = {
  theme: 'dark',
  lookupTimeRangePast: 24,
  lookupTimeRangeFuture: 24,
  cardsExpandedByDefault: false,
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const STORAGE_KEY = 'baggage-dashboard-settings';

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<typeof defaultSettings>(defaultSettings);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load settings from localStorage on initial render
  useEffect(() => {
    const loadSettings = () => {
      try {
        const savedSettings = localStorage.getItem(STORAGE_KEY);
        if (savedSettings) {
          const parsedSettings = JSON.parse(savedSettings);
          console.log('Loading settings from localStorage:', parsedSettings);
          setSettings(prevSettings => ({
            ...prevSettings,
            ...parsedSettings
          }));
        }
      } catch (error) {
        console.error('Failed to parse saved settings:', error);
      } finally {
        setIsInitialized(true);
      }
    };

    loadSettings();
  }, []);

  // Save settings to localStorage whenever they change
  // But only after initial loading is complete
  useEffect(() => {
    if (isInitialized) {
      console.log('Saving settings to localStorage:', settings);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    }
  }, [settings, isInitialized]);

  const setTheme = (theme: 'dark' | 'light') => {
    console.log('Setting theme to:', theme);
    setSettings(prev => ({ ...prev, theme }));
  };

  const setLookupTimeRangePast = (hours: number) => {
    setSettings(prev => ({ ...prev, lookupTimeRangePast: hours }));
  };

  const setLookupTimeRangeFuture = (hours: number) => {
    setSettings(prev => ({ ...prev, lookupTimeRangeFuture: hours }));
  };

  const setCardsExpandedByDefault = (expanded: boolean) => {
    console.log('Setting cardsExpandedByDefault to:', expanded);
    setSettings(prev => ({ ...prev, cardsExpandedByDefault: expanded }));
  };

  return (
    <SettingsContext.Provider
      value={{
        ...settings,
        setTheme,
        setLookupTimeRangePast,
        setLookupTimeRangeFuture,
        setCardsExpandedByDefault,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
} 