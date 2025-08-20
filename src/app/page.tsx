import Configurator from '@/components/configurator/configurator';
import { ThemeToggle } from '@/components/theme-toggle';

export default function Home({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12 relative">
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <Configurator searchParams={searchParams} />
    </div>
  );
}
