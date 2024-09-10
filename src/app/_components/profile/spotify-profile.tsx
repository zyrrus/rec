import Link from "next/link";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "~/app/_components/ui/avatar";
import { Button } from "~/app/_components/ui/button";
import { Card, CardDescription, CardTitle } from "~/app/_components/ui/card";
import type { SpotifyUserProfile } from "~/server/api/types/spotify-types";

export const SpotifyProfile = ({
  profile,
  isMe = false,
}: {
  profile: SpotifyUserProfile;
  isMe?: boolean;
}) => {
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
      <Button asChild>
        <Link href={isMe ? "/api/auth/signout" : "/api/auth/signin"}>
          {isMe ? "Sign out" : "Sign in"}
        </Link>
      </Button>
    </Card>
  );
};
