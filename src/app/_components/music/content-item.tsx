import Image from "next/image";
import Link from "next/link";

interface ContentItemProps {
  name: string;
  artist: string;
  image_url: string;
  external_url: string;
}

export const ContentItem = ({
  name,
  artist,
  image_url,
  external_url,
}: ContentItemProps) => {
  return (
    <div className="max-w-48 space-y-3">
      <div className="relative overflow-hidden rounded-md border">
        <Link href={external_url} target="_blank">
          <Image
            src={image_url}
            alt=""
            className="rounded shadow"
            height={192}
            width={192}
          />
        </Link>
      </div>
      <div className="space-y-1 text-sm">
        <h3 className="font-medium leading-none">{name}</h3>
        <p className="text-xs text-stone-500">{artist}</p>
      </div>
    </div>
  );
};
