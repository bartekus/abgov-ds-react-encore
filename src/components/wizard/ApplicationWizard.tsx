import { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ApplicationState, ConsolidatedFormDefinitions } from '../../types/formDefinitions';
import { parseFormDefinitions } from '../../utils/parseFormDefinitions';
import { StepIndicator } from './StepIndicator';
import { EligibilityStep } from '../steps/EligibilityStep';
import { CommonFormStep } from '../steps/CommonFormStep';
import { ScholarshipFormStep } from '../steps/ScholarshipFormStep';
import { ReviewStep } from '../steps/ReviewStep';
import { CompleteStep } from '../steps/CompleteStep';
import { GoabPageBlock } from '@abgov/react-components';

const initialState: ApplicationState = {
    currentStep: 'eligibility',
    eligibleScholarshipIds: [],
    currentScholarshipIndex: 0,
    formData: {
        common: {},
        scholarships: {}
    },
    isComplete: false
};

function getInitialState(location: ReturnType<typeof useLocation>): ApplicationState {
    const navState = location.state as { eligibleScholarshipIds?: string[] } | null;
    if (navState?.eligibleScholarshipIds?.length) {
        return {
            ...initialState,
            eligibleScholarshipIds: navState.eligibleScholarshipIds,
            currentStep: 'common',
        };
    }
    return initialState;
}

export function ApplicationWizard() {
    const location = useLocation();
    const [state, setState] = useState<ApplicationState>(() => getInitialState(location));

    // When arriving from eligibility page (e.g. browser back then forward), sync from location
    useEffect(() => {
        const navState = location.state as { eligibleScholarshipIds?: string[] } | null;
        if (navState?.eligibleScholarshipIds?.length && state.eligibleScholarshipIds.length === 0) {
            setState(prev => ({
                ...prev,
                eligibleScholarshipIds: navState.eligibleScholarshipIds ?? [],
                currentStep: 'common',
            }));
        }
    }, [location.state]);

    // In a real app, we might fetch this
    const formDefinitions: ConsolidatedFormDefinitions = useMemo(() => parseFormDefinitions(), []);

    // Derived state
    const eligibleScholarships = useMemo(() => {
        return formDefinitions.scholarships.filter(s => state.eligibleScholarshipIds.includes(s.scholarshipId));
    }, [formDefinitions, state.eligibleScholarshipIds]);

    const currentScholarship = eligibleScholarships[state.currentScholarshipIndex];

    // Handlers
    const handleEligibilityComplete = (eligibleIds: string[], _answers?: Record<string, string | string[]>) => {
        setState(prev => ({
            ...prev,
            eligibleScholarshipIds: eligibleIds,
            currentStep: 'common',
            formData: { ...prev.formData, scholarships: {} } // Reset scholarship data if re-running eligibility?
        }));
    };

    const handleCommonFieldChange = (fieldId: string, value: any) => {
        setState(prev => ({
            ...prev,
            formData: {
                ...prev.formData,
                common: {
                    ...prev.formData.common,
                    [fieldId]: { value, isValid: true, touched: true }
                }
            }
        }));
    };

    const handleCommonFieldBlur = (fieldId: string) => {
        // Mark touched
        setState(prev => ({
            ...prev,
            formData: {
                ...prev.formData,
                common: {
                    ...prev.formData.common,
                    [fieldId]: { ...prev.formData.common[fieldId], touched: true }
                }
            }
        }));
    };

    const handleScholarshipFieldChange = (fieldId: string, value: any) => {
        if (!currentScholarship) return;
        const sId = currentScholarship.scholarshipId;

        setState(prev => ({
            ...prev,
            formData: {
                ...prev.formData,
                scholarships: {
                    ...prev.formData.scholarships,
                    [sId]: {
                        ...(prev.formData.scholarships[sId] || {}),
                        [fieldId]: { value, isValid: true, touched: true }
                    }
                }
            }
        }));
    };

    const handleScholarshipFieldBlur = (fieldId: string) => {
        if (!currentScholarship) return;
        const sId = currentScholarship.scholarshipId;

        setState(prev => ({
            ...prev,
            formData: {
                ...prev.formData,
                scholarships: {
                    ...prev.formData.scholarships,
                    [sId]: {
                        ...(prev.formData.scholarships[sId] || {}),
                        [fieldId]: { ...(prev.formData.scholarships[sId]?.[fieldId]), touched: true }
                    }
                }
            }
        }));
    };

    const handleDocumentUpload = (documentId: string, file: File | null) => {
        // TODO: Store file in state or upload immediately
        console.log('Document uploaded:', documentId, file?.name);
        // For now, treat as a field value ? Or separate state?
        // existing code used separate state, but our interface put it in values?
        // Let's assume it's just a log for this demo
    };

    const handleNext = () => {
        setState(prev => {
            switch (prev.currentStep) {
                case 'common':
                    if (eligibleScholarships.length > 0) {
                        return { ...prev, currentStep: 'scholarship', currentScholarshipIndex: 0 };
                    }
                    return { ...prev, currentStep: 'review' };
                case 'scholarship':
                    if (prev.currentScholarshipIndex < eligibleScholarships.length - 1) {
                        return { ...prev, currentScholarshipIndex: prev.currentScholarshipIndex + 1 };
                    }
                    return { ...prev, currentStep: 'review' };
                case 'review':
                    return { ...prev, currentStep: 'complete', isComplete: true };
                default:
                    return prev;
            }
        });
    };

    const handleBack = () => {
        setState(prev => {
            switch (prev.currentStep) {
                case 'common':
                    return { ...prev, currentStep: 'eligibility' };
                case 'scholarship':
                    if (prev.currentScholarshipIndex > 0) {
                        return { ...prev, currentScholarshipIndex: prev.currentScholarshipIndex - 1 };
                    }
                    return { ...prev, currentStep: 'common' };
                case 'review':
                    if (eligibleScholarships.length > 0) {
                        return { ...prev, currentStep: 'scholarship', currentScholarshipIndex: eligibleScholarships.length - 1 };
                    }
                    return { ...prev, currentStep: 'common' };
                default:
                    return prev;
            }
        });
    };

    const handleReset = () => {
        setState(initialState);
    };

    // Steps for Indicator
    const steps = [
        { id: 'eligibility', label: 'Eligibility' },
        { id: 'common', label: 'Applicant Profile' },
        ...eligibleScholarships.map((s, i) => ({ id: `scholarship-${i}`, label: s.scholarshipName })), // This might be too many dots if many scholarships
        { id: 'review', label: 'Review' },
        { id: 'complete', label: 'Complete' }
    ];

    // Map current step to index
    let currentStepIndex = 0;
    if (state.currentStep === 'common') currentStepIndex = 1;
    else if (state.currentStep === 'scholarship') currentStepIndex = 2 + state.currentScholarshipIndex;
    else if (state.currentStep === 'review') currentStepIndex = 2 + eligibleScholarships.length;
    else if (state.currentStep === 'complete') currentStepIndex = 3 + eligibleScholarships.length;


    // Render
    return (
        <GoabPageBlock>
            {state.currentStep !== 'eligibility' && state.currentStep !== 'complete' && (
                <StepIndicator steps={steps.slice(0, 5)} currentStepIndex={currentStepIndex > 4 ? 4 : currentStepIndex} />
                // Limiting steps display for simplicity in this demo
            )}

            {state.currentStep === 'eligibility' && (
                <EligibilityStep onComplete={handleEligibilityComplete} />
            )}

            {state.currentStep === 'common' && (
                <CommonFormStep
                    formDefinitions={formDefinitions}
                    values={state.formData.common}
                    onFieldChange={handleCommonFieldChange}
                    onFieldBlur={handleCommonFieldBlur}
                    onNext={handleNext}
                    onBack={handleBack}
                    eligibleCount={eligibleScholarships.length}
                />
            )}

            {state.currentStep === 'scholarship' && currentScholarship && (
                <ScholarshipFormStep
                    scholarship={currentScholarship}
                    scholarshipIndex={state.currentScholarshipIndex}
                    totalScholarships={eligibleScholarships.length}
                    values={state.formData.scholarships[currentScholarship.scholarshipId] || {}}
                    uploadedDocuments={{}} // TODO: link validation
                    onFieldChange={handleScholarshipFieldChange}
                    onFieldBlur={handleScholarshipFieldBlur}
                    onDocumentUpload={handleDocumentUpload}
                    onNext={handleNext}
                    onBack={handleBack}
                />
            )}

            {state.currentStep === 'review' && (
                <ReviewStep
                    formDefinitions={formDefinitions}
                    eligibleScholarships={eligibleScholarships}
                    commonValues={state.formData.common}
                    scholarshipValues={state.formData.scholarships}
                    onSubmit={handleNext}
                    onBack={handleBack}
                />
            )}

            {state.currentStep === 'complete' && (
                <CompleteStep
                    scholarshipCount={eligibleScholarships.length}
                    onReset={handleReset}
                />
            )}

        </GoabPageBlock>
    );
}
