import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Sora } from 'next/font/google'

const sora = Sora({ subsets: ['latin'], variable: '--font-sans', weight: ['300', '400', '500', '600', '700'] })


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
      <body className={`${sora.variable} font-sans antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
