import Configurator from '@/components/configurator/configurator';

export default function Home({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-background">
      <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      <div className="absolute -z-10 -top-40 left-0">
          <div className="relative h-[550px] w-[550px] rounded-full bg-[radial-gradient(circle_farthest-side,hsl(var(--primary)/0.2),transparent)]"></div>
      </div>
       <div className="absolute -z-10 -bottom-40 -right-20">
          <div className="relative h-[450px] w-[650px] rounded-full bg-[radial-gradient(circle_farthest-side,hsl(var(--accent)/0.15),transparent)]"></div>
      </div>
      <div className="container mx-auto px-4 py-8 md:py-12 relative z-10">
        <Configurator searchParams={searchParams} />
      </div>
    </main>
  );
}
