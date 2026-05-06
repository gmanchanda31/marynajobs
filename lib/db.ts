import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// Use a parseable placeholder if DATABASE_URL isn't set so module-load (build-time
// page-data collection) doesn't crash. Real queries against this URL will fail at
// runtime, which is the correct behaviour — env vars must be set in production.
const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://placeholder:placeholder@placeholder.invalid/placeholder?sslmode=require";

const sql = neon(connectionString);
export const db = drizzle(sql, { schema });
