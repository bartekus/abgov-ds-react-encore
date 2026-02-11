export interface Answer {
  questionId: string;
  value: string | string[];
  subAnswers?: Record<string, string | string[]>;
}

export interface EliminatedScholarship {
  scholarshipId: string;
  reason: string;
  eliminatedByQuestionId: string;
}

export interface EligibilityState {
  answers: Record<string, Answer>;
  eligibleScholarships: string[];
  eliminatedScholarships: EliminatedScholarship[];
  preferredScholarships: string[];
  currentTier: number;
}

export interface EliminationRule {
  ruleId: string;
  condition: string;
  action: 'eliminate' | 'keep_only' | 'eliminate_all' | 'add_preference';
  eliminationMessage: string;
  eliminatedScholarships?: string[];
  keptScholarships?: string[];
  preferredScholarships?: string[];
}

export interface QuestionOption {
  optionId: string;
  optionText: string;
  value: string;
  scholarshipImpact?: any; // To limit complexity
}

export interface ConditionalQuestion {
  triggeredBy: string;
  subQuestionId: string;
  subQuestionText: string;
  questionType: 'single_choice' | 'text_area' | 'course_marks_input';
  options?: QuestionOption[];
  maxLength?: number;
  helpText?: string;
  inputFields?: any[];
}

export interface InputField {
  fieldId: string;
  fieldType: string;
  minValue?: number;
  maxValue?: number;
  placeholder?: string;
}

export interface Question {
  questionId: string;
  questionText: string;
  questionType: 'single_choice' | 'multiple_choice' | 'course_marks_input' | 'text_area';
  required: boolean;
  options?: QuestionOption[];
  eliminationRules?: EliminationRule[];
  conditionalDisplay?: {
    showIf: string;
  };
  conditionalQuestions?: ConditionalQuestion[];
  inputFields?: InputField[];
  helpText?: string;
  additionalInfo?: Record<string, string>;
  validationRules?: any[];
}

export interface QuestionTier {
  tierId: string;
  tierOrder: number;
  tierName: string;
  tierDescription: string;
  estimatedEliminationRate: string;
  questions: Question[];
}

// Extended Scholarship Interface for Registry
export interface ScholarshipAwardValue {
  masters?: number;
  doctoral?: number;
}

export interface ScholarshipEntry {
  scholarshipId: string;
  scholarshipName: string;
  applicationDeadline: string;
  applicationPeriod: string;
  paymentTiming: string;
  numberOfAwards: number;
  awardValue: number | ScholarshipAwardValue;
}

export interface QuestionnaireMetadata {
  title?: string;
  description: string;
  version: string;
  lastUpdated: string;
  totalScholarships: number;
}

export interface ProcessingInstructions {
  questionFlowLogic: string;
  eliminationStrategy: string;
  preferenceHandling: string;
  tieBreaking: string;
  finalOutput: Record<string, string>;
}

export interface EligibilityData {
  questionnaireMetadata: QuestionnaireMetadata;
  scholarshipRegistry: ScholarshipEntry[];
  questionTiers: QuestionTier[];
  processingInstructions: ProcessingInstructions;
}
