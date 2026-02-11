CREATE TABLE eligibility_submissions (
    id BIGSERIAL PRIMARY KEY,
    eligible_scholarship_ids JSONB NOT NULL DEFAULT '[]',
    answers JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
