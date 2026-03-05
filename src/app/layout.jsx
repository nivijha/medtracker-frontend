import { Syne, Hanken_Grotesk } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

const syne = Syne({ 
  subsets: ['latin'],
  variable: '--font-syne',
  display: 'swap',
});

const hanken = Hanken_Grotesk({ 
  subsets: ['latin'],
  variable: '--font-hanken',
  display: 'swap',
});

export const metadata = {
  title: 'MedTracker - Your Health Records Simplified',
  description: 'Securely store, organize, and access all your medical records in one place. Track medications, manage appointments, and take control of your health journey.',
  keywords: 'medical records, health tracker, medication reminder, appointments, healthcare management',
};

import { AuthProvider } from '@/context/AuthContext';

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${syne.variable} ${hanken.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <script src="https://accounts.google.com/gsi/client" async defer></script>
      </head>
      <body className="font-hanken antialiased bg-[#FAF9F6] text-[#1A2A3A]">
        <AuthProvider>
          {children}
          <Analytics />
        </AuthProvider>
      </body>
    </html>
  );
}