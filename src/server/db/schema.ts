// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import { int, sqliteTableCreator, text } from "drizzle-orm/sqlite-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = sqliteTableCreator(
  (name) => `farcaster-notcoin_${name}`,
);

export const users = createTable("users", {
  fid: int("fid", { mode: "number" }),
  username: text("username", { length: 256 }).notNull(),
  displayName: text("display_name", { length: 256 }).notNull(),
  avatar: text("avatar", { length: 256 }).notNull(),
  score: int("score", { mode: "number" }).default(0).notNull(),
  createdAt: int("created_at")
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: int("updated_at")
    .default(0)
    .$onUpdate(() => Math.floor(new Date().getTime() / 1000)),
});
