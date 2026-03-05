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
  title: 'MedTracker - Medical Records Manager',
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
        <meta name="google-site-verification" content="YSYlbkdAWuoCfIstO0E8a3VLL59FgkcLvYd1oL7qW8A" />
        <title>MedTracker – Medical Records Manager | Store Prescriptions & Reports</title>

        <meta name="description" content="MedTracker is a web application to store prescriptions, medical reports, and medications in one secure place." />

        <meta name="keywords" content="MedTracker, medical records manager, health records app, patient records management" />

        <meta name="author" content="Nivi Jha" />

        <meta property="og:title" content="MedTracker – Medical Record Manager" />  
        <meta property="og:description" content="Organize prescriptions, reports and medications in one place." />  
        <meta property="og:type" content="website" />  
        <meta property="og:url" content="https://medtracker-frontend.vercel.app" />  
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "MedTracker",
              applicationCategory: "HealthApplication",
              operatingSystem: "Web",
              description: "A full-stack web application to manage prescriptions, reports, and medical records.",
              url: "https://medtracker-frontend.vercel.app",
              author: {
                "@type": "Person",
                name: "Nivi Jha"
              }
            })
          }}
        />
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