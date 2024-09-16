import { SpotifyItem } from "~/app/_components/music/spotify-item";
import { type Album as AlbumProps } from "~/server/api/types/spotify-types";

export const Album = ({ name, artists, images, external_urls }: AlbumProps) => {
  return (
    <SpotifyItem
      name={name}
      artists={artists.map(({ name }) => name)}
      image={images[1]?.url}
      external_url={external_urls.spotify}
    />
  );
};
