import { eq } from "drizzle-orm";
import { env } from "~/env";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { db } from "~/server/db";
import { accounts } from "~/server/db/schema";
import { TRPCError } from "@trpc/server";
import type {
  SpotifyCurrentUserProfile,
  SpotifySearchResults,
  SpotifyUserProfile,
} from "~/server/api/types/spotify-types";
import { z } from "zod";

const getAccessToken = async (
  userId: string,
): Promise<{ access_token: string } | undefined> => {
  const account = await db.query.accounts.findFirst({
    where: eq(accounts.userId, userId),
  });

  if (account) {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`,
        ).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: account.refresh_token ?? "",
      }),
    });

    return response.json() as Promise<{ access_token: string }>;
  }
};

export const spotifyRouter = createTRPCRouter({
  getMe: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.session) {
      return null;
    }

    const tokenResponse = await getAccessToken(ctx.session.user.id);
    const token = tokenResponse?.access_token;

    if (!token) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Missing access token.",
      });
    }

    const response = await fetch("https://api.spotify.com/v1/me", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
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
  getUser: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.session) {
        return null;
      }

      const tokenResponse = await getAccessToken(ctx.session.user.id);
      const token = tokenResponse?.access_token;

      if (!token) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Missing access token.",
        });
      }

      const response = await fetch(
        `https://api.spotify.com/v1/users/${input.userId}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
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
  search: protectedProcedure
    .input(z.object({ query: z.string().max(128) }))
    .query(async ({ ctx, input }) => {
      if (input.query.length === 0) {
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

      const tokenResponse = await getAccessToken(ctx.session.user.id);
      const token = tokenResponse?.access_token;

      if (!token) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Missing access token.",
        });
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
          headers: { Authorization: `Bearer ${token}` },
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
