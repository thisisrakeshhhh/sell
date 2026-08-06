import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

export function getDb(d1Binding: D1Database) {
  return drizzle(d1Binding, { schema });
}

export type DbClient = ReturnType<typeof getDb>;
