import Link from "next/link";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "~/app/_components/ui/avatar";
import { Button } from "~/app/_components/ui/button";
import { Card, CardDescription, CardTitle } from "~/app/_components/ui/card";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";

export const SpotifyProfile = async () => {
  const session = await getServerAuthSession();
  const me = await api.spotify.me();

  return (
    <Card className="flex items-center space-x-4 p-6">
      <Avatar>
        <AvatarImage src={me.images[0]?.url} alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <CardTitle>Howdy, {me.display_name}!</CardTitle>
        <CardDescription>Optional message</CardDescription>
      </div>
      <Button asChild>
        <Link href={session ? "/api/auth/signout" : "/api/auth/signin"}>
          {session ? "Sign out" : "Sign in"}
        </Link>
      </Button>
    </Card>
  );
};
