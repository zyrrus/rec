import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const userListRouter = createTRPCRouter({
  getUnusedListsByUser: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    const usedLists = await ctx.db.user.findFirst({
      where: { id: userId },
      select: { lists: { select: { list_template_id: true } } },
    });

    if (usedLists === null) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Could not find user's curated lists.",
      });
    }

    const usedListIds = usedLists.lists.map(
      ({ list_template_id }) => list_template_id,
    );

    return ctx.db.listTemplate.findMany({
      where: { id: { notIn: usedListIds } },
    });
  }),
  getAllListsByUser: protectedProcedure.query(({ ctx }) =>
    ctx.db.user.findFirst({
      where: {
        id: ctx.session.user.id,
      },
      select: {
        lists: {
          where: { list_template: { deleted_at: null } },
          select: { contents: { select: { content: true } } },
        },
      },
    }),
  ),
});
