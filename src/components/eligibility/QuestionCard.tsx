import { useState } from 'react';
import {
    GoabRadioGroup,
    GoabRadioItem,
    GoabCheckbox,
    GoabTextArea,
    GoabInput,
    GoabBadge,
    GoabIcon,
    GoabButton,
} from '@abgov/react-components';
import type { Question, Answer, ConditionalQuestion } from '../../types/eligibility';

interface QuestionCardProps {
    question: Question;
    tierOrder: number;
    tierName: string;
    answer?: Answer;
    onAnswer: (questionId: string, value: string | string[], subAnswers?: Record<string, string | string[]>) => void;
    isAdminMode: boolean;
}

export function QuestionCard({
    question,
    tierOrder,
    tierName,
    answer,
    onAnswer,
    isAdminMode,
}: QuestionCardProps) {
    const [subAnswers, setSubAnswers] = useState<Record<string, string | string[]>>(
        answer?.subAnswers || {}
    );
    const [showRules, setShowRules] = useState(false);
    const isAnswered = answer !== undefined;

    // Find triggered conditional questions
    const triggeredConditionalQuestions = question.conditionalQuestions?.filter(
        (cq) => {
            // Logic: show sub-question if the answer matches the 'triggeredBy' option ID
            if (!answer) return false;

            // We need to find the option ID associated with the current answer VALUE
            // because `answer.value` stores the value (e.g. "yes") not the ID ("Q2_A")
            const selectedOption = question.options?.find(
                (opt) => opt.value === answer.value
            );

            return selectedOption && cq.triggeredBy === selectedOption.optionId;
        }
    );

    const handleSingleChoice = (name: string, value: string) => {
        onAnswer(question.questionId, value, subAnswers);
    };

    const handleMultipleChoice = (name: string, checked: boolean, value: string) => {
        const currentValues = Array.isArray(answer?.value) ? answer.value : [];
        let newValues: string[];

        if (checked) {
            newValues = [...currentValues, value];
        } else {
            newValues = currentValues.filter((v) => v !== value);
        }

        onAnswer(question.questionId, newValues, subAnswers);
    };

    const handleSubAnswer = (subQuestionId: string, value: string | string[]) => {
        const newSubAnswers = { ...subAnswers, [subQuestionId]: value };
        setSubAnswers(newSubAnswers);
        if (answer) {
            onAnswer(question.questionId, answer.value, newSubAnswers);
        }
    };

    const handleCourseMarkChange = (fieldId: string, value: string) => {
        const newSubAnswers = { ...subAnswers, [fieldId]: value };
        setSubAnswers(newSubAnswers);
        onAnswer(question.questionId, answer?.value ?? '', newSubAnswers);
    };

    const renderConditionalQuestion = (cq: ConditionalQuestion) => {
        if (cq.questionType === 'single_choice' && cq.options) {
            return (
                <div key={cq.subQuestionId} style={{ marginTop: '16px', paddingLeft: '16px', borderLeft: '2px solid #ccc' }}>
                    <p style={{ fontWeight: 500, marginBottom: '8px' }}>{cq.subQuestionText}</p>
                    <GoabRadioGroup
                        name={cq.subQuestionId}
                        value={(subAnswers[cq.subQuestionId] as string) || ''}
                        onChange={(detail) => handleSubAnswer(cq.subQuestionId, detail.value)}
                    >
                        {cq.options.map(o => (
                            <GoabRadioItem key={o.optionId} value={o.value} label={o.optionText} />
                        ))}
                    </GoabRadioGroup>
                </div>
            );
        }

        if (cq.questionType === 'text_area') {
            return (
                <div key={cq.subQuestionId} style={{ marginTop: '16px', paddingLeft: '16px', borderLeft: '2px solid #ccc' }}>
                    <p style={{ fontWeight: 500, marginBottom: '8px' }}>{cq.subQuestionText}</p>
                    <GoabTextArea
                        name={cq.subQuestionId}
                        value={(subAnswers[cq.subQuestionId] as string) || ''}
                        onChange={(detail) => handleSubAnswer(cq.subQuestionId, detail.value)}
                        width="100%"
                    />
                </div>
            )
        }

        return null;
    };

    return (
        <div style={{
            padding: '16px',
            marginBottom: '16px',
            border: '1px solid #e0e0e0',
            borderRadius: '4px',
            backgroundColor: isAnswered ? '#f9fff9' : 'white'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
                        <GoabBadge type="information" content={question.questionId} />
                        {question.required && <span style={{ color: '#d32f2f', fontWeight: 'bold' }}>*</span>}
                    </div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{question.questionText}</h3>
                </div>
                {isAnswered && <GoabIcon type="checkmark-circle" theme="outline" size="medium" style={{ color: 'green' }} />}
            </div>

            {question.questionType === 'single_choice' ? (
                <GoabRadioGroup
                    name={question.questionId}
                    value={answer?.value as string || ''}
                    onChange={(detail) => handleSingleChoice(detail.name, detail.value)}
                >
                    {question.options?.map(o => (
                        <GoabRadioItem key={o.optionId} value={o.value} label={o.optionText} />
                    ))}
                </GoabRadioGroup>
            ) : null}

            {question.questionType === 'multiple_choice' ? (
                <div>
                    {question.options?.map(option => {
                        const isChecked = Array.isArray(answer?.value) && answer.value.includes(option.value);
                        return (
                            <GoabCheckbox
                                key={option.optionId}
                                name={question.questionId}
                                checked={isChecked}
                                text={option.optionText}
                                value={option.value}
                                onChange={(detail) => handleMultipleChoice(detail.name, detail.checked, option.value)}
                            />
                        );
                    })}
                </div>
            ) : null}

            {/* Input Fields (e.g. Marks) */}
            {question.questionType === 'course_marks_input' && question.inputFields && (
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    {question.inputFields.map(field => (
                        <div key={field.fieldId} style={{ flex: '1 1 200px' }}>
                            <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.9rem' }}>{field.placeholder}</label>
                            <GoabInput
                                name={field.fieldId}
                                type="number"
                                value={(subAnswers[field.fieldId] as string) ?? ''}
                                placeholder={field.placeholder || ''}
                                onChange={(detail) => handleCourseMarkChange(field.fieldId, detail.value)}
                            />
                        </div>
                    ))}
                </div>
            )}

            {/* Conditional Sub-questions */}
            {triggeredConditionalQuestions && triggeredConditionalQuestions.length > 0 && (
                <div style={{ marginTop: '16px' }}>
                    {triggeredConditionalQuestions.map(renderConditionalQuestion)}
                </div>
            )}

            {/* Help Text */}
            {question.helpText && (
                <div style={{ marginTop: '16px', fontSize: '0.9rem', color: '#666', display: 'flex', gap: '8px' }}>
                    <GoabIcon type="information-circle" />
                    <span>{question.helpText}</span>
                </div>
            )}

            {/* Admin Mode Rules */}
            {isAdminMode && question.eliminationRules && (
                <div style={{ marginTop: '16px' }}>
                    <GoabButton type="tertiary" size="compact" onClick={() => setShowRules(!showRules)}>
                        {showRules ? 'Hide Rules' : 'Show Rules'}
                    </GoabButton>
                    {showRules && (
                        <div style={{ marginTop: '8px', padding: '8px', background: '#eee', fontSize: '0.8rem' }}>
                            {question.eliminationRules.map(r => (
                                <div key={r.ruleId}>
                                    {r.condition}  {r.action}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

        </div>
    );
}
