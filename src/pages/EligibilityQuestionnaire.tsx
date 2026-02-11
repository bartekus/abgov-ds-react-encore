import { EligibilityStep } from '../components/steps/EligibilityStep';
import { GoabPageBlock } from '@abgov/react-components';

export function EligibilityQuestionnaire() {
    const handleComplete = (eligibleScholarshipIds: string[]) => {
        console.log('Eligibility check complete. Eligible for:', eligibleScholarshipIds);
        // Navigate to next step or application form
        // useNavigate()...
        alert(`You are eligible for ${eligibleScholarshipIds.length} scholarships. Proceeding to application...`);
    };

    return (
        <GoabPageBlock>
            <EligibilityStep onComplete={handleComplete} />
        </GoabPageBlock>
    );
}
