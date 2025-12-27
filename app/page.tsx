import Image from "next/image";
import { SiteHeader } from "@/components/layout/site-header";
import { characters } from "@/data/characters";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <SiteHeader />

      <main className="flex-1">
        <div className="container max-w-7xl py-10 sm:py-12 lg:py-14">
          <h1 className="text-center text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Our AI Characters
          </h1>

          <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {characters.map((character) => (
              <article key={character.id} className="relative flex flex-col items-center">
                <div className="relative z-0 w-full overflow-hidden rounded-[28px] bg-white shadow">
                  <div className="relative h-[390px] w-full overflow-hidden rounded-[28px]">
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
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
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
