CREATE TABLE IF NOT EXISTS "eligibility_submissions" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"eligible_scholarship_ids" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"answers" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
