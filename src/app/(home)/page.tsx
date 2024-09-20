import { Suspense } from "react";
import { SpotifySearch } from "~/app/_components/music/spotify-search";
import { Header } from "~/app/_components/header";

export default async function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-12 px-3 py-12 sm:px-6">
      <Header />
      <div className="flex flex-col gap-3">
        <Suspense>
          <SpotifySearch />
        </Suspense>
      </div>
    </main>
  );
}
