import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Header } from "~/app/_components/header";
import { CreateNewList } from "~/app/u/[username]/create-new-list";
import { SpotifyProfile } from "~/app/u/[username]/spotify-profile";
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

  const isMe = myProfile?.id === profile.id;

  const myLists = await api.userLists.getAllListsByUser();

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-12 px-3 py-12 sm:px-6">
      <Header />
      <div className="flex flex-col gap-3">
        <Suspense>
          <SpotifyProfile profile={profile} isMe={isMe} />
        </Suspense>
        {isMe && (
          <>
            <CreateNewList />
            <code>
              <pre>{JSON.stringify(myLists, undefined, 2)}</pre>
            </code>
          </>
        )}
      </div>
    </main>
  );
}
