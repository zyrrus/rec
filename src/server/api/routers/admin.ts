import { checkIsAdmin } from "~/server/api/shared/admin";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const adminRouter = createTRPCRouter({
  checkIsAdmin: protectedProcedure.query(({ ctx }) =>
    checkIsAdmin(ctx.session.user.id),
  ),
});
