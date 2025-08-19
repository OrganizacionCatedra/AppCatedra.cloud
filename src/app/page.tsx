import Configurator from '@/components/configurator/configurator';

export default function Home({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-background">
      <div className="absolute inset-0 -z-10 h-full w-full">
        <div className="absolute top-0 left-0 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_farthest-side,hsl(var(--primary)/0.3),transparent)] blur-3xl"></div>
        <div className="absolute bottom-0 right-0 h-96 w-96 translate-x-1/2 translate-y-1/2 rounded-full bg-[radial-gradient(circle_farthest-side,hsl(var(--accent)/0.3),transparent)] blur-3xl"></div>
      </div>
      <div className="container mx-auto px-4 py-8 md:py-12 relative z-10">
        <Configurator searchParams={searchParams} />
      </div>
    </main>
  );
}