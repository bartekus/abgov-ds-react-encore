import { SQLDatabase } from "encore.dev/storage/sqldb";

const db = new SQLDatabase("eligibility", {
  migrations: "./migrations",
});

export { db };
