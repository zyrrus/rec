import { ContentItem } from "~/app/_components/music/content-item";
import { type Album as AlbumProps } from "~/server/api/types/spotify-types";

export const Album = ({ name, artists, images, external_urls }: AlbumProps) => {
  return (
    <ContentItem
      name={name}
      artist={artists.map(({ name }) => name).join(", ")}
      image_url={images[1]!.url}
      external_url={external_urls.spotify}
    />
  );
};
