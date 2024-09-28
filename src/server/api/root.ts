import { adminRouter } from "~/server/api/routers/admin";
import { curatorRouter } from "~/server/api/routers/curator";
import { spotifyRouter } from "~/server/api/routers/spotify";
import { userListRouter } from "~/server/api/routers/user-lists";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  spotify: spotifyRouter,
  admin: adminRouter,
  curator: curatorRouter,
  userLists: userListRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
