import { api, APIError } from "encore.dev/api";
import { db } from "./database";
import { eligibilitySubmissions } from "./schema";

export interface SubmitEligibilityRequest {
  eligibleScholarshipIds: string[];
  answers?: Record<string, string | string[]>;
}

export interface SubmitEligibilityResponse {
  success: boolean;
  submissionId: number;
}

/**
 * Submit eligibility questionnaire results (eligible scholarship IDs and optional answers).
 */
export const submit = api(
  { expose: true, method: "POST", path: "/eligibility/submit" },
  async (
    body: SubmitEligibilityRequest
  ): Promise<SubmitEligibilityResponse> => {
    try {
      if (
        !Array.isArray(body.eligibleScholarshipIds) ||
        body.eligibleScholarshipIds.some((id) => typeof id !== "string")
      ) {
        throw APIError.invalidArgument(
          "eligibleScholarshipIds must be an array of strings"
        );
      }
      const answers = body.answers ?? {};
      const [row] = await db
        .insert(eligibilitySubmissions)
        .values({
          eligibleScholarshipIds: body.eligibleScholarshipIds,
          answers,
        })
        .returning({ id: eligibilitySubmissions.id });
      const submissionId = row?.id ?? 0;
      return { success: true, submissionId };
    } catch (error) {
      if (error instanceof APIError) throw error;
      throw APIError.internal(
        error instanceof Error ? error.message : "Failed to submit eligibility"
      );
    }
  }
);
