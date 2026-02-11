import { useMemo } from 'react';
import type { ScholarshipEntry, EliminatedScholarship, ScholarshipAwardValue } from '../../types/eligibility';
import { GoabBadge, GoabIcon } from '@abgov/react-components';

interface ScholarshipSidebarProps {
    scholarships: ScholarshipEntry[];
    eligibleIds: string[];
    eliminatedScholarships: EliminatedScholarship[];
    isAdminMode: boolean;
}

function formatAwardValue(value: number | ScholarshipAwardValue): string {
    if (typeof value === 'number') {
        return `$${value.toLocaleString()}`;
    }
    if (value.masters && value.doctoral) {
        return `$${value.masters.toLocaleString()} - $${value.doctoral.toLocaleString()}`;
    }
    return 'Variable';
}

export function ScholarshipSidebar({
    scholarships,
    eligibleIds,
    eliminatedScholarships: _eliminatedScholarships,
    isAdminMode: _isAdminMode,
}: ScholarshipSidebarProps) {
    const eligible = useMemo(
        () => scholarships.filter((s) => eligibleIds.includes(s.scholarshipId)),
        [scholarships, eligibleIds]
    );

    // Note: logic in source for eliminated was slightly redundant but useful for display

    return (
        <div style={{ width: '100%', maxWidth: '350px' }}>
            <div style={{ position: 'sticky', top: '20px' }}>

                {/* Status Card */}
                <div style={{ padding: '16px', backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '4px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <GoabIcon type="ribbon" size="medium" fillColor="green" />
                        <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{eligible.length}</span>
                        <span>Eligible Scholarships</span>
                    </div>
                </div>

                {/* List */}
                <div style={{ backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ padding: '12px', borderBottom: '1px solid #eee', backgroundColor: '#f9f9f9', fontWeight: 600 }}>
                        Eligible Scholarships
                    </div>

                    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        {eligible.length === 0 ? (
                            <div style={{ padding: '24px', textAlign: 'center', color: '#666' }}>
                                No eligible scholarships found yet.
                            </div>
                        ) : (
                            eligible.map(s => (
                                <div key={s.scholarshipId} style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
                                    <div style={{ fontWeight: 500, marginBottom: '4px' }}>{s.scholarshipName}</div>
                                    <div style={{ display: 'flex', gap: '4px' }}>
                                        <GoabBadge type="information" content={formatAwardValue(s.awardValue)} />
                                        <GoabBadge type="emergency" content={s.applicationDeadline} />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
