import './globals.css';
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { cn } from '@/lib/utils';

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'ToastTrade',
  description: 'ToastTrade - Alcohol Auction',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={cn(poppins.className, 'bg-white dark:bg-[#313338]')}>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          storageKey='toast-trade-theme'
          enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
