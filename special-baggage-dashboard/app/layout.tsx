import '@/styles/globals.css';
import { Inter } from 'next/font/google';
import { ReactNode } from 'react';
import Providers from '@/components/Providers';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Special Baggage Loading Dashboard',
  description: 'Monitor special baggage loading status',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Inline script to set theme before page renders to prevent flash */}
        <script 
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const storedSettings = localStorage.getItem('baggage-dashboard-settings');
                if (storedSettings) {
                  const settings = JSON.parse(storedSettings);
                  if (settings.theme) {
                    document.documentElement.classList.add(settings.theme + '-theme');
                    document.documentElement.setAttribute('data-theme', settings.theme);
                  }
                }
              } catch (e) {
                console.error('Error applying stored theme:', e);
              }
            `
          }}
        />
      </head>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
} 