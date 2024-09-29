import { TRPCError } from "@trpc/server";
import { z } from "zod";
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
          select: {
            list_template: {
              select: {
                id: true,
                title: true,
                description: true,
                content_type: true,
                length: true,
              },
            },
            contents: { select: { content: true } },
          },
        },
      },
    }),
  ),
  selectNewList: protectedProcedure
    .input(z.object({ list_template_id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const list_template_id = input.list_template_id;
      const user_id = ctx.session.user.id;

      const existingList = await ctx.db.userList.findFirst({
        where: { AND: { list_template_id, user_id } },
        select: { id: true },
      });

      if (existingList === null) {
        return ctx.db.userList.create({ data: { list_template_id, user_id } });
      }

      throw new TRPCError({
        code: "CONFLICT",
        message: "A list template with that ID already exists for this user.",
      });
    }),
});
