import { SpotifyItem } from "~/app/_components/music/spotify-item";
import { type Track as TrackProps } from "~/server/api/types/spotify-types";

export const Track = ({ name, artists, album, external_urls }: TrackProps) => {
  return (
    <SpotifyItem
      name={name}
      artists={artists.map(({ name }) => name)}
      image={album.images[1]?.url}
      external_url={external_urls.spotify}
    />
  );
};
