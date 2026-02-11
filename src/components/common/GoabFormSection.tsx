import { GoabGrid } from '@abgov/react-components';
import { FormSection, ApplicationFormData } from '../../types/formDefinitions';
import { GoabDynamicFormField } from './GoabDynamicFormField';

interface GoabFormSectionProps {
    section: FormSection;
    formData: ApplicationFormData;
    onChange: (fieldId: string, value: any, isValid: boolean) => void;
    showErrors?: boolean;
    /** When provided, values are read from formData.scholarships[scholarshipId] */
    scholarshipId?: string;
}

export function GoabFormSection({
    section,
    formData,
    onChange,
    showErrors = false,
    scholarshipId,
}: GoabFormSectionProps) {

    // Helper to get field value safely
    const getValue = (fieldId: string) => {
        if (scholarshipId && formData?.scholarships?.[scholarshipId]) {
            return formData.scholarships[scholarshipId][fieldId] ?? { value: '', isValid: false, touched: false };
        }
        const common = formData?.common;
        return common?.[fieldId] ?? { value: '', isValid: false, touched: false };
    };

    return (
        <div style={{ marginBottom: '24px' }}>
            <h3 style={{ marginBottom: '16px' }}>{section.sectionTitle}</h3>
            {section.sectionDescription && <p style={{ marginBottom: '16px' }}>{section.sectionDescription}</p>}

            <GoabGrid minChildWidth="300px" gap="l">
                {section.fields.map(field => {
                    // Check conditional display logic
                    if (field.conditionalOn) {
                        // Simple parsing of "fieldId === 'Value'"
                        // This is a naive implementation, might need a proper expression parser if conditions are complex
                        // The source uses a more robust evaluator. We might need to port that.
                        // For now, let's implement basic equality check
                        const [depField, depVal] = field.conditionalOn.split('===')
                            .map(s => s.trim().replace(/['"]/g, ''));
                        const parentVal = getValue(depField)?.value;
                        if (String(parentVal) !== depVal) {
                            return null;
                        }
                    }

                    return (
                        <GoabDynamicFormField
                            key={field.fieldId}
                            field={field}
                            value={getValue(field.fieldId)}
                            onChange={(val, isValid) => onChange(field.fieldId, val, isValid)}
                            showError={showErrors}
                        />
                    );
                })}
            </GoabGrid>
        </div>
    );
}
