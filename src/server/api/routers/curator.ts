import { and, eq, isNull } from "drizzle-orm";
import { z } from "zod";
import { curatedListSchema } from "~/server/api/shared/curator";
import {
  adminProcedure,
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";
import { curatedLists } from "~/server/db/schema";

export const curatorRouter = createTRPCRouter({
  createList: adminProcedure
    .input(curatedListSchema)
    .mutation(async ({ ctx, input }) => {
      const formatInput = {
        ...input,
        contentType: Array.from(input.contentType).join(","),
      };
      await ctx.db.insert(curatedLists).values(formatInput);
    }),
  getAllLists: publicProcedure.query(({ ctx }) =>
    ctx.db.query.curatedLists.findMany({
      orderBy: curatedLists.title,
      where: isNull(curatedLists.deletedAt),
    }),
  ),
  getList: publicProcedure
    .input(z.object({ listId: z.number() }))
    .query(({ ctx, input }) =>
      ctx.db.query.curatedLists.findFirst({
        where: and(
          eq(curatedLists.id, input.listId),
          isNull(curatedLists.deletedAt),
        ),
      }),
    ),
  //   updateList: adminProcedure.input(listSchema).query(({ ctx, input }) => {}),
  deleteList: adminProcedure
    .input(z.object({ listId: z.number() }))
    .mutation(({ ctx, input }) =>
      ctx.db
        .update(curatedLists)
        .set({ deletedAt: new Date() })
        .where(eq(curatedLists.id, input.listId)),
    ),
});
