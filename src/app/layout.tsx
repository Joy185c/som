import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { SiteSettingsProvider } from '@/components/SiteSettingsProvider';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { StickyCTA } from '@/components/ui/StickyCTA';

export const metadata: Metadata = {
  title: 'ShowOffs Media — We Make Brands Stand Out',
  description: 'Premium video production, Reels, Shorts, motion graphics. Book a meeting and see our portfolio.',
  openGraph: {
    title: 'ShowOffs Media — We Make Brands Stand Out',
    description: 'Premium video production, Reels, Shorts, motion graphics.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen antialiased bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
        <div className="bg-animated" aria-hidden />
        <ThemeProvider>
          <SiteSettingsProvider>
            <Navbar />
            <main className="relative">
              {children}
            </main>
            <Footer />
            <StickyCTA />
          </SiteSettingsProvider>
          <Toaster position="bottom-right" toastOptions={{ duration: 4000 }} />
        </ThemeProvider>
      </body>
    </html>
  );
}
