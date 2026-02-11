import { GoabButton } from '@abgov/react-components';
import { CommonFields, FormFieldValue } from '../../types/formDefinitions';
import { GoabFormSection } from '../common/GoabFormSection';

interface CommonFormStepProps {
    formDefinitions: { commonFields: CommonFields };
    values: Record<string, FormFieldValue>;
    onFieldChange: (fieldId: string, value: any) => void;
    onFieldBlur: (fieldId: string) => void;
    onNext: () => void;
    onBack: () => void;
    eligibleCount: number;
}

export function CommonFormStep({
    formDefinitions,
    values,
    onFieldChange,
    onFieldBlur,
    onNext,
    onBack,
    eligibleCount,
}: CommonFormStepProps) {

    // Simple validation check: ensure at least some fields are filled
    // In a real app, we would loop through all required fields in formDefinitions and check values.
    const isValid = true;

    const handleNext = () => {
        // Trigger validation logic if needed
        onNext();
    };

    return (
        <div>
            <h2 style={{ marginBottom: '16px' }}>Applicant Profile</h2>
            <p style={{ marginBottom: '24px' }}>
                Please provide your personal information. These details will be used for all <b>{eligibleCount}</b> scholarship applications.
            </p>

            {formDefinitions.commonFields.sections.map((section) => (
                <GoabFormSection
                    key={section.sectionId}
                    section={section}
                    formData={{ common: values, scholarships: {} }}
                    onChange={(fieldId, val) => onFieldChange(fieldId, val)}
                />
            ))}

            <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'space-between' }}>
                <GoabButton type="secondary" onClick={onBack}>Back to Eligibility</GoabButton>
                <GoabButton type="primary" onClick={handleNext}>Next: Scholarship Details</GoabButton>
            </div>
        </div>
    );
}
