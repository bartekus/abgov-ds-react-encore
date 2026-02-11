import { GoabButton, GoabIcon } from '@abgov/react-components';

interface CompleteStepProps {
    scholarshipCount: number;
    onReset: () => void;
}

export function CompleteStep({ scholarshipCount, onReset }: CompleteStepProps) {
    return (
        <div style={{ textAlign: 'center', padding: '48px 24px' }}>
            <GoabIcon type="checkmark-circle" size="large" style={{ color: 'green', marginBottom: '16px' }} />
            <h1>Application Submitted!</h1>
            <p style={{ fontSize: '1.2rem', marginBottom: '32px' }}>
                You have successfully submitted applications for <b>{scholarshipCount}</b> scholarships.
            </p>

            <p>You will receive a confirmation email shortly.</p>

            <div style={{ marginTop: '48px' }}>
                <GoabButton type="primary" onClick={onReset}>Return to Home</GoabButton>
            </div>
        </div>
    );
}
