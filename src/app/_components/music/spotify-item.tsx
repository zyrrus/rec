import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "~/app/_components/ui/skeleton";

interface SpotifyItemProps {
  name: string;
  artists: string[];
  image?: string;
  external_url: string;
}

export const SpotifyItem = ({
  name,
  artists,
  image,
  external_url,
}: SpotifyItemProps) => {
  return (
    <div className="max-w-48 space-y-3">
      <div className="relative overflow-hidden rounded-md border">
        <Link href={external_url} target="_blank">
          {image ? (
            <Image
              src={image}
              alt="album cover"
              className="rounded shadow"
              height={192}
              width={192}
            />
          ) : (
            <Skeleton className="size-48" />
          )}
        </Link>
      </div>
      <div className="space-y-1 text-sm">
        <h3 className="font-medium leading-none">{name}</h3>
        <p className="text-xs text-stone-500">{artists.join(", ")}</p>
      </div>
    </div>
  );
};
