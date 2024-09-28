import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const userListRouter = createTRPCRouter({
  // TODO: Correct with userCuratedList model
  // getUnusedListsByUser: protectedProcedure.query(async ({ ctx }) => {
  //   const userId = ctx.session.user.id;
  //   const usedLists = await ctx.db.user.findFirst({
  //     where: { id: userId },
  //     select: { UserRole: { select: { user_id: true } } },
  //   });
  //   if (usedLists === null) {
  //     throw new TRPCError({
  //       code: "NOT_FOUND",
  //       message: "Could not find user's curated lists.",
  //     });
  //   }
  //   const usedListIds = usedLists.UserRole.map(({ user_id }) => user_id);
  //   return ctx.db.curatedList.findMany({
  //     where: { id: { notIn: usedListIds } },
  //   });
  // }),
  // getAllListsByUser: protectedProcedure.query(({ ctx }) =>
  //   ctx.db.user.findFirst({
  //     where: {
  //       id: ctx.session.user.id,
  //     },
  //     select: {},
  //     include: { userCuratedLists: true },
  //   }),
  // ),
});
