import { ContentItem } from "~/app/_components/music/content-item";
import { type Track as TrackProps } from "~/server/api/types/spotify-types";

export const Track = ({ name, artists, album, external_urls }: TrackProps) => {
  return (
    <ContentItem
      name={name}
      artist={artists.map(({ name }) => name).join(", ")}
      image_url={album.images[1]!.url}
      external_url={external_urls.spotify}
    />
  );
};
