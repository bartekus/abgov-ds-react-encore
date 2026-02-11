import { GoabButton } from '@abgov/react-components';
import { ConsolidatedFormDefinitions, ScholarshipFormDefinition } from '../../types/formDefinitions';

interface ReviewStepProps {
    formDefinitions: ConsolidatedFormDefinitions;
    eligibleScholarships: ScholarshipFormDefinition[];
    commonValues: Record<string, any>; // Simplified type
    scholarshipValues: Record<string, Record<string, any>>;
    onSubmit: () => void;
    onBack: () => void;
}

export function ReviewStep({
    formDefinitions: _formDefinitions,
    eligibleScholarships,
    commonValues,
    scholarshipValues,
    onSubmit,
    onBack,
}: ReviewStepProps) {

    return (
        <div>
            <h2 style={{ marginBottom: '16px' }}>Review Your Applications</h2>
            <p style={{ marginBottom: '24px' }}>Please review your information before submitting.</p>

            {/* Common Details Summary */}
            <div style={{ marginBottom: '24px', border: '1px solid #ccc', borderRadius: '4px', padding: '16px' }}>
                <h3 style={{ marginTop: 0, borderBottom: '1px solid #eee', paddingBottom: '8px' }}>Applicant Profile</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
                    {/* Simplified view: just showing some key fields would require mapping IDs to Labels */}
                    {Object.entries(commonValues).map(([key, val]) => (
                        <div key={key}>
                            <div style={{ fontSize: '0.8rem', color: '#666' }}>{key}</div>
                            <div>{String(val.value)}</div>
                        </div>
                    ))}
                </div>
            </div>

            {eligibleScholarships.map(s => (
                <div key={s.scholarshipId} style={{ marginBottom: '24px', border: '1px solid #ccc', borderRadius: '4px', padding: '16px' }}>
                    <h3 style={{ marginTop: 0, borderBottom: '1px solid #eee', paddingBottom: '8px' }}>{s.scholarshipName}</h3>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
                        {scholarshipValues[s.scholarshipId] && Object.entries(scholarshipValues[s.scholarshipId]).map(([key, val]) => (
                            <div key={key}>
                                <div style={{ fontSize: '0.8rem', color: '#666' }}>{key}</div>
                                <div>{String(val.value)}</div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'space-between' }}>
                <GoabButton type="secondary" onClick={onBack}>Back</GoabButton>
                <GoabButton type="primary" onClick={onSubmit}>Submit Applications</GoabButton>
            </div>
        </div>
    );
}
