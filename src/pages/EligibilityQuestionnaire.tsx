import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EligibilityStep } from '../components/steps/EligibilityStep';
import { GoabPageBlock } from '@abgov/react-components';
import { api } from '../lib/get-request-client';

export function EligibilityQuestionnaire() {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleComplete = async (
        eligibleScholarshipIds: string[],
        answers: Record<string, string | string[]>
    ) => {
        setError(null);
        setIsSubmitting(true);
        try {
            const result = await api.users.submit({
                eligibleScholarshipIds,
                answers,
            });
            if (result.success) {
                navigate('/scholarship-application', {
                    state: { eligibleScholarshipIds, submissionId: result.submissionId },
                });
            }
        } catch (e) {
            const message = e instanceof Error ? e.message : 'Failed to submit eligibility';
            setError(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <GoabPageBlock>
            {error && (
                <div role="alert" style={{ marginBottom: 16, padding: 12, background: '#f8d7da', color: '#721c24', borderRadius: 4 }}>
                    {error}
                </div>
            )}
            <EligibilityStep
                onComplete={handleComplete}
                isSubmitting={isSubmitting}
            />
        </GoabPageBlock>
    );
}
