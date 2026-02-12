import { config } from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "drizzle-kit";

config({ path: resolve(dirname(fileURLToPath(import.meta.url)), "../../.env") });

export default defineConfig({
  out: "./migrations",
  schema: "./schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
    ssl: {
      rejectUnauthorized: false,
      ca: process.env.DATABASE_CA,
    },
  },
});
