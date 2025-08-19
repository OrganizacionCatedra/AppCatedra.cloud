import Configurator from '@/components/configurator/configurator';

export default function Home({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-background">
      <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,hsl(var(--primary)/0.1)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--primary)/0.1)_1px,transparent_1px)] bg-[size:32px_32px]"></div>
      <div className="container mx-auto px-4 py-8 md:py-12 relative z-10">
        <Configurator searchParams={searchParams} />
      </div>
    </main>
  );
}
