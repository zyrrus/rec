import { TRPCError } from "@trpc/server";
import { eq, notInArray } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { curatedLists, users } from "~/server/db/schema";

export const userListRouter = createTRPCRouter({
  getUnusedListsByUser: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    const usedLists = await ctx.db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: {},
      with: { curatedLists: { columns: { id: true } } },
    });

    if (!usedLists) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Could not find user's curated lists.",
      });
    }

    const usedListIds = usedLists.curatedLists.map(({ id }) => id);
    return ctx.db.query.curatedLists.findMany({
      where: notInArray(curatedLists.id, usedListIds),
    });
  }),
  getAllListsByUser: protectedProcedure.query(({ ctx }) =>
    ctx.db.query.users.findFirst({
      where: eq(users.id, ctx.session.user.id),
      columns: {},
      with: { curatedLists: true },
    }),
  ),
});
