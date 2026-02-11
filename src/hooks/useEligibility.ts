import { useState, useCallback, useMemo } from 'react';
import type {
    EligibilityData,
    Answer,
    EliminatedScholarship,
    EligibilityState,
    Question,
    EliminationRule,
} from '../types/eligibility';

export function useEligibility(data: EligibilityData) {
    const allScholarshipIds = useMemo(
        () => data.scholarshipRegistry.map((s) => s.scholarshipId),
        [data.scholarshipRegistry]
    );

    const [state, setState] = useState<EligibilityState>({
        answers: {},
        eligibleScholarships: allScholarshipIds,
        eliminatedScholarships: [],
        preferredScholarships: [],
        currentTier: 1,
    });

    // Evaluate a condition string against current answers
    const evaluateCondition = useCallback(
        (condition: string, questionId: string, value: string | string[]): boolean => {
            // Handle simple value comparisons
            if (condition.includes('value ==')) {
                const match = condition.match(/value\s*==\s*'([^']+)'/);
                if (match) {
                    return value === match[1];
                }
            }

            if (condition.includes('value !=')) {
                const match = condition.match(/value\s*!=\s*'([^']+)'/);
                if (match) {
                    return value !== match[1];
                }
            }

            // Handle OR conditions
            if (condition.includes(' OR ')) {
                const parts = condition.split(' OR ');
                return parts.some((part) => evaluateCondition(part.trim(), questionId, value));
            }

            // Handle selectedValues.includes
            if (condition.includes('selectedValues.includes')) {
                const match = condition.match(/selectedValues\.includes\('([^']+)'\)/);
                if (match && Array.isArray(value)) {
                    const checkValue = match[1];
                    const includes = value.includes(checkValue);
                    // Check for negation
                    if (condition.startsWith('!')) {
                        return !includes;
                    }
                    return includes;
                }
            }

            return false;
        },
        []
    );

    // Apply elimination rules for a question
    const applyEliminationRules = useCallback(
        (
            rules: EliminationRule[] | undefined,
            questionId: string,
            value: string | string[],
            currentEligible: string[],
            currentEliminated: EliminatedScholarship[]
        ): { eligible: string[]; eliminated: EliminatedScholarship[] } => {
            if (!rules || rules.length === 0) {
                return { eligible: currentEligible, eliminated: currentEliminated };
            }

            let eligible = [...currentEligible];
            const eliminated = [...currentEliminated];

            for (const rule of rules) {
                if (evaluateCondition(rule.condition, questionId, value)) {
                    switch (rule.action) {
                        case 'eliminate_all':
                            eligible.forEach((id) => {
                                if (!eliminated.find((e) => e.scholarshipId === id)) {
                                    eliminated.push({
                                        scholarshipId: id,
                                        reason: rule.eliminationMessage,
                                        eliminatedByQuestionId: questionId,
                                    });
                                }
                            });
                            eligible = [];
                            break;

                        case 'eliminate':
                            if (rule.eliminatedScholarships) {
                                rule.eliminatedScholarships.forEach((id) => {
                                    if (eligible.includes(id)) {
                                        eligible = eligible.filter((e) => e !== id);
                                        eliminated.push({
                                            scholarshipId: id,
                                            reason: rule.eliminationMessage,
                                            eliminatedByQuestionId: questionId,
                                        });
                                    }
                                });
                            }
                            break;

                        case 'keep_only':
                            if (rule.keptScholarships) {
                                const toEliminate = eligible.filter(
                                    (id) => !rule.keptScholarships!.includes(id)
                                );
                                toEliminate.forEach((id) => {
                                    eliminated.push({
                                        scholarshipId: id,
                                        reason: rule.eliminationMessage,
                                        eliminatedByQuestionId: questionId,
                                    });
                                });
                                eligible = eligible.filter((id) =>
                                    rule.keptScholarships!.includes(id)
                                );
                            }
                            break;
                    }
                }
            }

            return { eligible, eliminated };
        },
        [evaluateCondition]
    );

    // Recalculate eligibility from scratch based on all answers
    const recalculateEligibility = useCallback(
        (answers: Record<string, Answer>) => {
            let eligible = [...allScholarshipIds];
            let eliminated: EliminatedScholarship[] = [];

            // Go through all tiers and questions in order
            for (const tier of data.questionTiers) {
                for (const question of tier.questions) {
                    const answer = answers[question.questionId];
                    if (answer && question.eliminationRules) {
                        const result = applyEliminationRules(
                            question.eliminationRules,
                            question.questionId,
                            answer.value,
                            eligible,
                            eliminated
                        );
                        eligible = result.eligible;
                        eliminated = result.eliminated;
                    }
                }
            }

            return { eligible, eliminated };
        },
        [allScholarshipIds, data.questionTiers, applyEliminationRules]
    );

    // Answer a question
    const answerQuestion = useCallback(
        (questionId: string, value: string | string[], subAnswers?: Record<string, string | string[]>) => {
            setState((prev) => {
                const newAnswers = {
                    ...prev.answers,
                    [questionId]: { questionId, value, subAnswers },
                };

                const { eligible, eliminated } = recalculateEligibility(newAnswers);

                return {
                    ...prev,
                    answers: newAnswers,
                    eligibleScholarships: eligible,
                    eliminatedScholarships: eliminated,
                };
            });
        },
        [recalculateEligibility]
    );

    // Clear an answer
    const clearAnswer = useCallback(
        (questionId: string) => {
            setState((prev) => {
                const newAnswers = { ...prev.answers };
                delete newAnswers[questionId];

                const { eligible, eliminated } = recalculateEligibility(newAnswers);

                return {
                    ...prev,
                    answers: newAnswers,
                    eligibleScholarships: eligible,
                    eliminatedScholarships: eliminated,
                };
            });
        },
        [recalculateEligibility]
    );

    // Check if a question should be displayed based on conditional logic
    const shouldShowQuestion = useCallback(
        (question: Question): boolean => {
            if (!question.conditionalDisplay) {
                return true;
            }

            const showIf = question.conditionalDisplay.showIf;

            // Parse conditions like "Q3.value == 'high_school_graduate'"
            const simpleMatch = showIf.match(/(\w+)\.value\s*==\s*'([^']+)'/);
            if (simpleMatch) {
                const [, qId, expectedValue] = simpleMatch;
                const answer = state.answers[qId];
                return answer?.value === expectedValue;
            }

            // Parse conditions like "Q3.value != 'not_enrolled'"
            const notMatch = showIf.match(/(\w+)\.value\s*!=\s*'([^']+)'/);
            if (notMatch) {
                const [, qId, expectedValue] = notMatch;
                const answer = state.answers[qId];
                if (!answer) return false;
                return answer.value !== expectedValue;
            }

            // Parse AND conditions
            if (showIf.includes(' AND ')) {
                const parts = showIf.split(' AND ');
                return parts.every((part) => {
                    const match = part.trim().match(/(\w+)\.value\s*(==|!=)\s*'([^']+)'/);
                    if (match) {
                        const [, qId, operator, expectedValue] = match;
                        const answer = state.answers[qId];
                        if (!answer) return operator === '!=';
                        return operator === '=='
                            ? answer.value === expectedValue
                            : answer.value !== expectedValue;
                    }
                    return true;
                });
            }

            // Parse OR conditions
            if (showIf.includes(' OR ')) {
                const parts = showIf.split(' OR ');
                return parts.some((part) => {
                    const match = part.trim().match(/(\w+)\.value\s*==\s*'([^']+)'/);
                    if (match) {
                        const [, qId, expectedValue] = match;
                        const answer = state.answers[qId];
                        return answer?.value === expectedValue;
                    }
                    return false;
                });
            }

            // Handle selectedValues.includes
            if (showIf.includes('selectedValues.includes')) {
                const match = showIf.match(/(\w+)\.selectedValues\.includes\('([^']+)'\)/);
                if (match) {
                    const [, qId, checkValue] = match;
                    const answer = state.answers[qId];
                    if (Array.isArray(answer?.value)) {
                        return answer.value.includes(checkValue);
                    }
                }
            }

            // Handle selectedOptions.length > 0
            if (showIf.includes('selectedOptions.length > 0')) {
                const match = showIf.match(/(\w+)\.selectedOptions\.length > 0/);
                if (match) {
                    const qId = match[1];
                    const answer = state.answers[qId];
                    if (Array.isArray(answer?.value)) {
                        return answer.value.length > 0;
                    }
                }
            }

            return true;
        },
        [state.answers]
    );

    // Reset the questionnaire
    const resetQuestionnaire = useCallback(() => {
        setState({
            answers: {},
            eligibleScholarships: allScholarshipIds,
            eliminatedScholarships: [],
            preferredScholarships: [],
            currentTier: 1,
        });
    }, [allScholarshipIds]);

    // Get visible questions for each tier
    const getVisibleQuestions = useCallback(
        (tierId: string): Question[] => {
            const tier = data.questionTiers.find((t) => t.tierId === tierId);
            if (!tier) return [];
            return tier.questions.filter(shouldShowQuestion);
        },
        [data.questionTiers, shouldShowQuestion]
    );

    // Calculate progress
    const progress = useMemo(() => {
        const totalQuestions = data.questionTiers.reduce(
            (acc, tier) => acc + tier.questions.filter(shouldShowQuestion).length,
            0
        );
        const answeredQuestions = Object.keys(state.answers).length;
        return totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0;
    }, [data.questionTiers, state.answers, shouldShowQuestion]);

    return {
        state,
        answerQuestion,
        clearAnswer,
        shouldShowQuestion,
        resetQuestionnaire,
        getVisibleQuestions,
        progress,
        allScholarships: data.scholarshipRegistry,
        tiers: data.questionTiers,
        metadata: data.questionnaireMetadata,
    };
}
