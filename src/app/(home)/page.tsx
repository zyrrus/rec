import { Suspense } from "react";
import { SpotifyProfile } from "~/app/(home)/spotify-profile";
import { SpotifySearch } from "~/app/(home)/spotify-search";
import { api } from "~/trpc/server";

export default async function Home() {
  void api.spotify.me.prefetch();

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-12 px-3 py-12 sm:px-6">
      <h1 className="text-center text-5xl font-extrabold tracking-wide sm:text-[5rem]">
        rec
      </h1>
      <div className="flex flex-col gap-3">
        <Suspense>
          <SpotifyProfile />
        </Suspense>
        <Suspense>
          <SpotifySearch />
        </Suspense>
      </div>
    </main>
  );
}
