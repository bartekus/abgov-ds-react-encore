import * as p from "drizzle-orm/pg-core";

export const users = p.pgTable("users", {
  id: p.serial().primaryKey(),
  name: p.text().notNull(),
  surname: p.text().notNull().unique(),
});

export const eligibilitySubmissions = p.pgTable("eligibility_submissions", {
  id: p.bigserial({ mode: "number" }).primaryKey(),

  eligibleScholarshipIds: p
      .jsonb("eligible_scholarship_ids")
      .notNull()
      .default([]),

  answers: p
      .jsonb("answers")
      .notNull()
      .default({}),

  createdAt: p
      .timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
});