import { and, eq } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { Role, userRoles } from "~/server/db/schema/roles";

export const adminRouter = createTRPCRouter({
  checkIsAdmin: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const userRole = await ctx.db.query.userRoles.findFirst({
      where: and(eq(userRoles.userId, userId), eq(userRoles.role, Role.admin)),
    });

    return userRole !== undefined;
  }),
});
