import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Inter } from 'next/font/google';
import BackgroundPlexus from '@/components/configurator/background-plexus';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });


export const metadata: Metadata = {
  title: 'IA Solutions Configurator',
  description: 'Configure y cotice su solución de IA a medida.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        <BackgroundPlexus />
        <main className="relative z-10">
            {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}
