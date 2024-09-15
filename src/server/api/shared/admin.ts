import { and, eq } from "drizzle-orm";
import { db } from "~/server/db";
import { Role, userRoles } from "~/server/db/schema";

export const checkIsAdmin = async (userId: string) => {
  const userRole = await db.query.userRoles.findFirst({
    where: and(eq(userRoles.userId, userId), eq(userRoles.role, Role.admin)),
  });

  return userRole !== undefined;
};
