"use client";

import { type PropsWithChildren } from "react";
import { keepPreviousData } from "@tanstack/react-query";
import { Album } from "~/app/_components/music/album";
import { SearchBar, useDebouncedSearch } from "~/app/_components/search-bar";
import { Track } from "~/app/_components/music/track";
import { Card, CardContent } from "~/app/_components/ui/card";
import { api } from "~/trpc/react";

export const SpotifySearch = () => {
  const { searchQuery, handleSearchInputChange } = useDebouncedSearch();

  const query = api.spotify.search.useQuery(
    { query: searchQuery },
    { placeholderData: keepPreviousData },
  );

  return (
    <>
      <Card>
        <CardContent className="pt-6">
          <SearchBar
            placeholder="Search for albums, songs, or artists"
            handleSearchInputChange={handleSearchInputChange}
          />
        </CardContent>
      </Card>

      {!query.data || query.isLoading ? (
        searchQuery.length > 0 && (
          <Card>
            <CardContent className="animate-pulse pt-6">loading...</CardContent>
          </Card>
        )
      ) : (
        <>
          {query.data.albums.items.length > 0 && (
            <SearchResults heading="Albums">
              {query.data.albums.items.map((album) => (
                <Album key={album.id} {...album} />
              ))}
            </SearchResults>
          )}

          {query.data.tracks.items.length > 0 && (
            <SearchResults heading="Tracks">
              {query.data.tracks.items.map((track) => (
                <Track key={track.id} {...track} />
              ))}
            </SearchResults>
          )}
        </>
      )}
    </>
  );
};

const SearchResults = ({
  heading,
  children,
}: PropsWithChildren<{ heading: string }>) => {
  return (
    <Card>
      <CardContent className="space-y-3 pt-6">
        <h3 className="font-semibold leading-none tracking-tight">{heading}</h3>
        <div className="flex flex-row flex-wrap justify-between gap-6">
          {children}
        </div>
      </CardContent>
    </Card>
  );
};
