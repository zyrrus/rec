import { integer, text } from "drizzle-orm/sqlite-core";
import { createTable } from "~/server/db/schema/create-table";

export const curatedLists = createTable("curated_list", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description"),
  length: integer("length", { mode: "number" }).notNull(),
  contentType: text("contentType").notNull(), // Comma separated list of contentTypes
});
