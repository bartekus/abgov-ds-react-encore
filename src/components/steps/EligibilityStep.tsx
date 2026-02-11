import { useState, useMemo } from 'react';
import { GoabContainer, GoabButton, GoabIcon } from '@abgov/react-components';
import { useEligibility } from '../../hooks/useEligibility';
import { TierSection } from '../eligibility/TierSection';
import { ScholarshipSidebar } from '../eligibility/ScholarshipSidebar';
import eligibilityDataRaw from '../../data/eligibility.json';
import { EligibilityData } from '../../types/eligibility';

// Helper to parse data consistently
function parseEligibilityData(): EligibilityData {
    return eligibilityDataRaw as unknown as EligibilityData;
}

interface EligibilityStepProps {
    onComplete?: (eligibleScholarshipIds: string[]) => void;
}

export function EligibilityStep({ onComplete }: EligibilityStepProps) {
    const [isAdminMode, setIsAdminMode] = useState(false);
    const data = useMemo(() => parseEligibilityData(), []);

    const {
        state,
        answerQuestion,
        resetQuestionnaire,
        getVisibleQuestions,
        progress,
        allScholarships,
        tiers,
        metadata,
    } = useEligibility(data);

    const canProceed = state.eligibleScholarships.length > 0 && progress > 0; // Simplified progress check

    return (
        <div style={{ padding: '24px' }}>
            <h1 style={{ marginBottom: '16px' }}>Eligibility Questionnaire</h1>
            <p style={{ marginBottom: '24px' }}>Answer the following questions to determine which Alberta Heritage Scholarships you may be eligible to apply for.</p>

            <div style={{ display: 'flex', flexDirection: 'row', gap: '24px', flexWrap: 'wrap' }}>
                <div style={{ flex: '1', minWidth: '300px' }}>
                    {tiers.map(tier => (
                        <TierSection
                            key={tier.tierId}
                            tier={tier}
                            visibleQuestions={getVisibleQuestions(tier.tierId)}
                            answers={state.answers}
                            onAnswer={answerQuestion}
                            isAdminMode={isAdminMode}
                            isOpen={tier.tierOrder <= 2}
                        />
                    ))}

                    <div style={{ marginTop: '24px', display: 'flex', gap: '16px', justifyContent: 'center' }}>
                        <GoabButton type="secondary" onClick={resetQuestionnaire}>Reset</GoabButton>
                        <GoabButton
                            type="primary"
                            disabled={!canProceed}
                            onClick={() => onComplete && onComplete(state.eligibleScholarships)}
                        >
                            Continue to Application
                        </GoabButton>
                    </div>
                </div>

                <ScholarshipSidebar
                    scholarships={allScholarships}
                    eligibleIds={state.eligibleScholarships}
                    eliminatedScholarships={state.eliminatedScholarships}
                    isAdminMode={isAdminMode}
                />
            </div>
        </div>
    );
}
