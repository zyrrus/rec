import { eq } from "drizzle-orm";
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
    .mutation(({ ctx, input }) => ctx.db.insert(curatedLists).values(input)),
  getList: publicProcedure
    .input(z.object({ listId: z.number() }))
    .query(({ ctx, input }) =>
      ctx.db.query.curatedLists.findFirst({
        where: eq(curatedLists.id, input.listId),
      }),
    ),
  getAllLists: publicProcedure.query(({ ctx }) =>
    ctx.db.query.curatedLists.findMany({ orderBy: curatedLists.title }),
  ),
  //   updateList: adminProcedure.input(listSchema).query(({ ctx, input }) => {}),
  //   deleteList: adminProcedure.query(({ ctx }) => {}),
});
