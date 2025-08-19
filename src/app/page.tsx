import Configurator from '@/components/configurator/configurator';
import { ThemeToggle } from '@/components/theme-toggle';

export default function Home({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-white dark:bg-black">
       <div className="absolute inset-0 -z-10 h-full w-full bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 dark:from-indigo-900/50 dark:via-purple-900/50 dark:to-pink-900/50" />
       <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
       </div>
      <div className="container mx-auto px-4 py-8 md:py-12 relative z-10">
        <Configurator searchParams={searchParams} />
      </div>
    </main>
  );
}
