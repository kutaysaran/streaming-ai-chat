import Image from "next/image";
import { SiteHeader } from "@/components/layout/site-header";
import { characters } from "@/data/characters";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white overflow-hidden">
      <SiteHeader />

      <main className="flex flex-1 flex-col overflow-y-auto">
        <div className="container flex min-h-[calc(100vh-64px)] max-w-7xl flex-col gap-10 py-8 sm:py-10 lg:py-12">
          <h1 className="text-center text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Our AI Characters
          </h1>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {characters.map((character) => (
              <article key={character.id} className="relative flex flex-col items-center">
                <div className="relative z-0 w-full overflow-hidden rounded-[28px] bg-white shadow">
                  <div className="relative h-[340px] w-full overflow-hidden rounded-[28px]">
                    <Image
                      src={character.image}
                      alt={character.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      priority
                    />
                  </div>
                </div>

                <div className="relative z-10 -mt-12 w-[94%] rounded-2xl border border-border bg-white px-6 py-5 shadow-lg sm:w-[90%]">
                  <h2 className="text-lg font-semibold text-foreground">
                    {character.name}
                  </h2>
                  <p className="text-base font-medium text-muted-foreground">
                    {character.role}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground line-clamp-3">
                    {character.description}
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    Ready to chat
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
