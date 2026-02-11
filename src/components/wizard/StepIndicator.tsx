import { GoabIcon } from '@abgov/react-components';

interface StepIndicatorProps {
    steps: { id: string; label: string }[];
    currentStepIndex: number;
}

export function StepIndicator({ steps, currentStepIndex }: StepIndicatorProps) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', position: 'relative' }}>
            {/* Line behind steps */}
            <div style={{ position: 'absolute', top: '50%', left: '0', right: '0', height: '2px', backgroundColor: '#ccc', zIndex: 0 }}></div>

            {steps.map((step, index) => {
                const isCompleted = index < currentStepIndex;
                const isCurrent = index === currentStepIndex;

                let statusColor = '#ccc';
                let icon = null;

                if (isCompleted) {
                    statusColor = 'green';
                    icon = <div style={{ color: 'white', display: 'flex' }}><GoabIcon type="checkmark" size="small" /></div>;
                } else if (isCurrent) {
                    statusColor = '#003366';
                }

                return (
                    <div key={step.id} style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: 'white', padding: '0 8px' }}>
                        <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            backgroundColor: statusColor,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: 'bold',
                            marginBottom: '8px',
                            border: isCurrent ? '2px solid #003366' : 'none'
                        }}>
                            {isCompleted ? icon : (index + 1)}
                        </div>
                        <span style={{ fontSize: '0.8rem', fontWeight: isCurrent ? 'bold' : 'normal', color: isCurrent ? '#003366' : '#666' }}>
                            {step.label}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}
