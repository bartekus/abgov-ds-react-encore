import { GoabButton, GoabBadge } from '@abgov/react-components';
import { ScholarshipFormDefinition, FormFieldValue } from '../../types/formDefinitions';
import { GoabFormSection } from '../common/GoabFormSection';
import { GoabRequiredDocuments } from '../common/GoabRequiredDocuments';

interface ScholarshipFormStepProps {
    scholarship: ScholarshipFormDefinition;
    scholarshipIndex: number;
    totalScholarships: number;
    values: Record<string, FormFieldValue>;
    uploadedDocuments: Record<string, File | null>;
    onFieldChange: (fieldId: string, value: any) => void;
    onFieldBlur: (fieldId: string) => void;
    onDocumentUpload: (documentId: string, file: File | null) => void;
    onNext: () => void;
    onBack: () => void;
}

export function ScholarshipFormStep({
    scholarship,
    scholarshipIndex,
    totalScholarships,
    values,
    uploadedDocuments,
    onFieldChange,
    onFieldBlur: _onFieldBlur,
    onDocumentUpload,
    onNext,
    onBack,
}: ScholarshipFormStepProps) {

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ margin: 0 }}>{scholarship.scholarshipName}</h2>
                <GoabBadge type="information" content={`Application ${scholarshipIndex + 1} of ${totalScholarships}`} />
            </div>

            <p style={{ marginBottom: '24px' }}>
                Please provide strict details for this specific scholarship.
            </p>

            {scholarship.specificFields.map((section) => (
                <GoabFormSection
                    key={section.sectionId}
                    section={section}
                    formData={{
                        common: {},
                        scholarships: { [scholarship.scholarshipId]: values },
                    }}
                    onChange={(fieldId, val) => onFieldChange(fieldId, val)}
                    scholarshipId={scholarship.scholarshipId}
                />
            ))}

            {scholarship.requiredDocuments && scholarship.requiredDocuments.length > 0 && (
                <div style={{ marginTop: '24px' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '16px' }}>Required Documents</h3>
                    <GoabRequiredDocuments
                        documents={scholarship.requiredDocuments}
                        uploadedFiles={uploadedDocuments}
                        onUpload={(docId, file) => onDocumentUpload(docId, file)}
                        onRemove={(docId) => onDocumentUpload(docId, null)}
                    />
                </div>
            )}

            <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'space-between' }}>
                <GoabButton type="secondary" onClick={onBack}>Back</GoabButton>
                <GoabButton type="primary" onClick={onNext}>
                    {scholarshipIndex === totalScholarships - 1 ? 'Review Applications' : 'Next Scholarship'}
                </GoabButton>
            </div>
        </div>
    );
}
