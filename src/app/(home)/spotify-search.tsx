"use client";

import { keepPreviousData } from "@tanstack/react-query";
import { Album } from "~/app/_components/album";
import { SearchBar, useDebouncedSearch } from "~/app/_components/search-bar";
import { Track } from "~/app/_components/track";
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
            placeholder="Search for artists or tracks"
            handleSearchInputChange={handleSearchInputChange}
          />
        </CardContent>
      </Card>

      {!query.data ? (
        searchQuery.length > 0 && (
          <Card>
            <CardContent className="animate-pulse pt-6">loading...</CardContent>
          </Card>
        )
      ) : (
        <>
          {query.data.albums.items.length > 0 && (
            <Card>
              <CardContent className="space-y-3 pt-6">
                <h3 className="font-semibold leading-none tracking-tight">
                  Albums
                </h3>

                <div className="flex flex-row flex-wrap justify-between gap-6">
                  {query.data.albums.items.map((album) => (
                    <Album key={album.id} {...album} />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {query.data.tracks.items.length > 0 && (
            <Card>
              <CardContent className="space-y-3 pt-6">
                <h3 className="font-semibold leading-none tracking-tight">
                  Tracks
                </h3>
                <div className="flex flex-row flex-wrap justify-between gap-6">
                  {query.data.tracks.items.map((track) => (
                    <Track key={track.id} {...track} />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </>
  );
};
