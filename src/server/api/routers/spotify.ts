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
  SpotifySearchResults,
  SpotifyUserProfile,
} from "~/server/api/types/spotify-types";

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
  me: protectedProcedure.query(async ({ ctx }) => {
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

    const data = (await response.json()) as SpotifyUserProfile;
    return data;
  }),
  search: protectedProcedure.query(async ({ ctx }) => {
    const tokenResponse = await getAccessToken(ctx.session.user.id);
    const token = tokenResponse?.access_token;

    if (!token) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Missing access token.",
      });
    }

    const params = new URLSearchParams({
      q: "nmixx",
      type: "album,track",
      limit: "10",
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
