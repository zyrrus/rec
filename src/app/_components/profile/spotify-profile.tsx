import Link from "next/link";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "~/app/_components/ui/avatar";
import { Button } from "~/app/_components/ui/button";
import { Card, CardDescription, CardTitle } from "~/app/_components/ui/card";
import type { SpotifyUserProfile } from "~/server/api/types/spotify-types";
import { getServerAuthSession } from "~/server/auth";

export const SpotifyProfile = async ({
  profile,
  isMe = false,
}: {
  profile: SpotifyUserProfile;
  isMe?: boolean;
}) => {
  const session = await getServerAuthSession();

  return (
    <Card className="flex items-center space-x-4 p-6">
      {profile && (
        <Avatar>
          <AvatarImage
            src={profile.images[0]?.url}
            alt={`@${profile.display_name}`}
          />
          <AvatarFallback>{profile.display_name.charAt(0)}</AvatarFallback>
        </Avatar>
      )}
      <div className="flex-1">
        <CardTitle>
          {profile ? `Howdy, ${profile.display_name}!` : "Welcome!"}
        </CardTitle>
        <CardDescription>
          {profile ? "Optional message" : "Sign in to start sharing music"}
        </CardDescription>
      </div>
      {isMe && (
        <Button asChild>
          <Link href={session ? "/api/auth/signout" : "/api/auth/signin"}>
            {session ? "Sign out" : "Sign in"}
          </Link>
        </Button>
      )}
    </Card>
  );
};
