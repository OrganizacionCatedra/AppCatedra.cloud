import Configurator from '@/components/configurator/configurator';

export default function Home({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200">
      <div className="container mx-auto px-4 py-8 md:py-12 relative z-10">
        <Configurator searchParams={searchParams} />
      </div>
    </main>
  );
}
