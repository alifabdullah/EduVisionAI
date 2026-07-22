import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import { CounselingProvider } from "@/context/CounselingContext";
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: "EduVision AI — Intelligent Academic Platform",
  description: "An AI-powered multi-role academic intelligence platform for students, teachers, and institutional authorities.",
  icons: {
    icon: [
      { url: '/diu_crest.png', type: 'image/png' },
    ],
    apple: '/diu_crest.png',
    shortcut: '/diu_crest.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <link rel="icon" href="/diu_crest.png" type="image/png" />
        <link rel="apple-touch-icon" href="/diu_crest.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body>
        <AppProvider>
          <CounselingProvider>
            {children}
            <Toaster position="top-right" richColors theme="dark" />
          </CounselingProvider>
        </AppProvider>
      </body>
    </html>
  );
}
