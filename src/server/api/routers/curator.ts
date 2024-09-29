import { z } from "zod";
import { listTemplateSchema } from "~/server/api/shared/curator";
import {
  adminProcedure,
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";

export const curatorRouter = createTRPCRouter({
  createList: adminProcedure
    .input(listTemplateSchema)
    .mutation(({ ctx, input }) =>
      ctx.db.listTemplate.create({
        data: {
          title: input.title,
          description: input.description,
          length: input.length,
          content_type: Array.from(input.contentType).join(","),
        },
      }),
    ),
  getAllLists: publicProcedure.query(({ ctx }) =>
    ctx.db.listTemplate.findMany({
      orderBy: { title: "desc" },
      where: { deleted_at: null },
    }),
  ),
  getList: publicProcedure
    .input(z.object({ listId: z.number() }))
    .query(({ ctx, input }) =>
      ctx.db.listTemplate.findFirst({
        where: {
          AND: {
            deleted_at: null,
            id: input.listId,
          },
        },
      }),
    ),
  //   updateList: adminProcedure.input(listSchema).query(({ ctx, input }) => {}),
  deleteList: adminProcedure
    .input(z.object({ listId: z.number() }))
    .mutation(({ ctx, input }) =>
      ctx.db.listTemplate.update({
        where: { id: input.listId },
        data: {
          deleted_at: new Date(),
        },
      }),
    ),
});
