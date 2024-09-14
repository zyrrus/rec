import { createTRPCRouter, spotifyProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import type {
  SpotifyCurrentUserProfile,
  SpotifySearchResults,
  SpotifyUserProfile,
} from "~/server/api/types/spotify-types";
import { z } from "zod";

export const spotifyRouter = createTRPCRouter({
  getMe: spotifyProcedure.query(async ({ ctx }) => {
    if (!ctx.token) {
      return null;
    }

    const response = await fetch("https://api.spotify.com/v1/me", {
      method: "GET",
      headers: { Authorization: `Bearer ${ctx.token}` },
    });

    if (!response.ok) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: `Spotify API Error - status: ${response.status}`,
      });
    }

    const data = (await response.json()) as SpotifyCurrentUserProfile;
    return data;
  }),
  getUser: spotifyProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.token) {
        return null;
      }

      const response = await fetch(
        `https://api.spotify.com/v1/users/${input.userId}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${ctx.token}` },
        },
      );

      if (!response.ok) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Spotify API Error - status: ${response.status}`,
        });
      }

      const data = (await response.json()) as SpotifyUserProfile;
      return data;
    }),
  search: spotifyProcedure
    .input(z.object({ query: z.string().max(128) }))
    .query(async ({ ctx, input }) => {
      if (input.query.length === 0 || !ctx.token) {
        return {
          tracks: {
            href: "",
            limit: 0,
            next: null,
            offset: 0,
            previous: null,
            total: 0,
            items: [],
          },
          albums: {
            href: "",
            limit: 0,
            next: null,
            offset: 0,
            previous: null,
            total: 0,
            items: [],
          },
        };
      }

      const params = new URLSearchParams({
        q: input.query,
        type: "album,track",
        limit: "6",
      }).toString();
      const response = await fetch(
        `https://api.spotify.com/v1/search?${params}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${ctx.token}` },
        },
      );

      if (!response.ok) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Spotify API Error - status: ${response.status}`,
        });
      }

      const data = (await response.json()) as SpotifySearchResults;
      return data;
    }),
});
