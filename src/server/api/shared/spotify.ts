import { eq } from "drizzle-orm";
import { env } from "~/env";
import { db } from "~/server/db";
import { accounts } from "~/server/db/schema";

export const getAccessToken = async (
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
