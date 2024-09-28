import { Role } from "~/app/_lib/constants/user-roles";
import { db } from "~/server/db";

export const checkIsAdmin = async (userId: string) => {
  const userRole = await db.userRole.findFirst({
    where: { AND: { user_id: userId, role: Role.admin } },
  });

  return userRole !== undefined;
};
