import './globals.css';
import { Inter, Playfair_Display } from 'next/font/google';
import { AuthProvider } from '@/hooks/use-auth';
import Header from '@/components/layout/header';
import Navbar from '@/components/layout/navbar';
import { initializeDatabase } from '@/lib/neon';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

export const metadata = {
  title: 'Litera - Platform Sosial Literasi Digital',
  description: 'Akses gratis untuk membaca, menulis, dan mendiskusikan berbagai karya literatur',
};

// Initialize database on startup
initializeDatabase();

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen bg-cream dark:bg-gray-900 text-gray-900 dark:text-cream transition-colors duration-300">
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow pt-16 pb-20">
              {children}
            </main>
            <Navbar />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
  }
