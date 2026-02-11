import { useState } from 'react';
import { GoabContainer, GoabBadge, GoabIcon, GoabButton } from '@abgov/react-components';
import { QuestionCard } from './QuestionCard';
import type { QuestionTier, Question, Answer } from '../../types/eligibility';

interface TierSectionProps {
    tier: QuestionTier;
    visibleQuestions: Question[];
    answers: Record<string, Answer>;
    onAnswer: (questionId: string, value: string | string[], subAnswers?: Record<string, string | string[]>) => void;
    isAdminMode: boolean;
    isOpen?: boolean;
}

export function TierSection({
    tier,
    visibleQuestions,
    answers,
    onAnswer,
    isAdminMode,
    isOpen = true,
}: TierSectionProps) {
    const [open, setOpen] = useState(isOpen);
    const answeredCount = visibleQuestions.filter((q) => answers[q.questionId]).length;
    const totalCount = visibleQuestions.length;

    if (totalCount === 0) {
        return null;
    }

    return (
        <div style={{ marginBottom: '24px' }}>
            {/* Custom Collapsible Header since GoabContainer doesn't have native collapse in all versions, or we want custom styling */}
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px',
                    backgroundColor: 'white',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    borderLeft: `4px solid var(--goa-color-interactive-default)`, // Using generic color for now
                    cursor: 'pointer'
                }}
                onClick={() => setOpen(!open)}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: '#003366',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold'
                    }}>
                        {tier.tierOrder}
                    </div>
                    <div>
                        <h2 style={{ margin: 0, fontSize: '1.2rem' }}>{tier.tierName}</h2>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>{tier.tierDescription}</p>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <GoabBadge type={answeredCount === totalCount ? 'success' : 'information'} content={`${answeredCount}/${totalCount} answered`} />
                    {open ? <GoabIcon type="chevron-up" /> : <GoabIcon type="chevron-down" />}
                </div>
            </div>

            {open && (
                <div style={{ marginTop: '16px', paddingLeft: '8px' }}>
                    {visibleQuestions.map(question => (
                        <QuestionCard
                            key={question.questionId}
                            question={question}
                            tierOrder={tier.tierOrder}
                            tierName={tier.tierName}
                            answer={answers[question.questionId]}
                            onAnswer={onAnswer}
                            isAdminMode={isAdminMode}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
