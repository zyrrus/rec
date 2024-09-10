import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Header } from "~/app/_components/header";
import { SpotifyProfile } from "~/app/_components/profile/spotify-profile";
import { api } from "~/trpc/server";

export default async function Profile({
  params,
}: {
  params: { username: string };
}) {
  const myProfile = await api.spotify.getMe();
  const profile = await api.spotify.getUser({ userId: params.username });

  if (!profile) {
    redirect("/");
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-12 px-3 py-12 sm:px-6">
      <Header />
      <div className="flex flex-col gap-3">
        <Suspense>
          <SpotifyProfile
            profile={profile}
            isMe={myProfile?.id === profile.id}
          />
        </Suspense>
      </div>
    </main>
  );
}
