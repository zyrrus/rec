import { getServerAuthSession } from "~/server/auth";
import { notFound, redirect } from "next/navigation";
import { api } from "~/trpc/server";

/** The route `/u/` will redirect to `/u/[username]` */
export default async function Profile() {
  const session = await getServerAuthSession();

  if (session) {
    const profile = await api.spotify.getMe();
    redirect(profile ? `/u/${profile.id}` : "/");
  }

  notFound();
}
