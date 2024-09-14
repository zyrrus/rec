import { primaryKey, text } from "drizzle-orm/sqlite-core";
import { users } from "~/server/db/schema/auth";
import { createTable } from "~/server/db/schema/create-table";

export const Role = {
  admin: "admin",
};

export const userRoles = createTable(
  "user_role",
  {
    userId: text("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    role: text("role", { enum: [Role.admin] }).notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.role] }),
  }),
);
