import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'MedTracker - Your Health Records Simplified',
  description: 'Securely store, organize, and access all your medical records in one place. Track medications, manage appointments, and take control of your health journey.',
  keywords: 'medical records, health tracker, medication reminder, appointments, healthcare management',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}