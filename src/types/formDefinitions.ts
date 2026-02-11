// Type definitions for the Consolidated Form Definitions

export interface FormField {
    fieldId: string;
    label: string;
    dataType: 'text' | 'date' | 'select' | 'boolean' | 'textarea' | 'attachment' | 'signature' | 'number' | 'email' | 'phone';
    required: boolean;
    placeholder?: string;
    maxLength?: number;
    helpText?: string;
    conditionalOn?: string;
    options?: Array<{
        value: string;
        label: string;
    }>;
    validation?: {
        pattern?: string;
        message?: string;
    };
}

export interface FormSection {
    sectionId: string;
    sectionTitle: string;
    sectionDescription?: string;
    fields: FormField[];
}

export interface CommonFields {
    sections: FormSection[];
}

export interface RequiredDocument {
    documentId: string;
    documentName: string;
    description: string;
    required: boolean;
}

export interface ScholarshipFormDefinition {
    scholarshipId: string;
    scholarshipName: string;
    formCode: string;
    revision: string;
    specificFields: FormSection[];
    requiredDocuments?: RequiredDocument[];
}

export interface ConsolidatedFormDefinitions {
    title?: string;
    commonFields: CommonFields;
    scholarships: ScholarshipFormDefinition[];
}

// Application state types
export interface FormFieldValue {
    value: string | string[] | boolean | File | null;
    isValid: boolean;
    touched: boolean;
}

export interface ApplicationFormData {
    common: Record<string, FormFieldValue>;
    scholarships: Record<string, Record<string, FormFieldValue>>;
}

export type ApplicationStep =
    | 'eligibility'
    | 'common'
    | 'scholarship'
    | 'review'
    | 'complete';

export interface ApplicationState {
    currentStep: ApplicationStep;
    eligibleScholarshipIds: string[];
    currentScholarshipIndex: number;
    formData: ApplicationFormData;
    isComplete: boolean;
}
