import type { ConsolidatedFormDefinitions, FormField, FormSection, ScholarshipFormDefinition, RequiredDocument } from '../types/formDefinitions';
import rawData from '../data/consolidate-form-definitions.json';

// Define the shape of the raw JSON data
interface RawField {
    fieldName: string;
    label: string;
    dataType: string;
    description?: string;
    required: boolean;
    maxLength?: number;
    format?: string;
    acceptableValues?: string[];
    conditionalOn?: string;
    notes?: string;
    examples?: string[];
    section?: string;
}

interface RawDocument {
    documentName: string;
    description: string;
    required: boolean;
}

interface RawScholarship {
    scholarshipId: string;
    scholarshipName: string;
    formCode: string;
    revision: string;
    specificFields: RawField[];
    requiredDocuments?: RawDocument[];
}

interface RawCommonFields {
    personalInformation?: RawField[];
    contactInformation?: RawField[];
    citizenshipAndResidency?: RawField[];
    postSecondaryEnrolment?: RawField[];
    declaration?: RawField[];
}

interface RawFormData {
    version: string;
    academicYear: string;
    commonFields: RawCommonFields;
    scholarships: RawScholarship[];
}

function convertDataType(dataType: string): FormField['dataType'] {
    const typeMap: Record<string, FormField['dataType']> = {
        'text': 'text',
        'date': 'date',
        'select': 'select',
        'boolean': 'boolean',
        'textarea': 'textarea',
        'attachment': 'attachment',
        'signature': 'signature',
        'integer': 'number',
        'number': 'number',
        'email': 'email',
        'phone': 'phone',
    };
    return typeMap[dataType] || 'text';
}

function convertField(field: RawField): FormField {
    const formField: FormField = {
        fieldId: field.fieldName,
        label: field.label,
        dataType: convertDataType(field.dataType),
        required: field.required,
        maxLength: field.maxLength,
        helpText: field.description || field.notes,
        conditionalOn: field.conditionalOn,
    };

    if (field.acceptableValues && field.acceptableValues.length > 0) {
        formField.options = field.acceptableValues.map(v => ({
            value: v,
            label: v,
        }));
    }

    if (field.format) {
        formField.placeholder = field.format;
    }

    return formField;
}

function convertSection(sectionName: string, fields: RawField[]): FormSection {
    const titleMap: Record<string, string> = {
        'personalInformation': 'Personal Information',
        'contactInformation': 'Contact Information',
        'citizenshipAndResidency': 'Citizenship and Residency',
        'postSecondaryEnrolment': 'Post-Secondary Enrolment',
        'declaration': 'Declaration',
    };

    return {
        sectionId: sectionName,
        sectionTitle: titleMap[sectionName] || sectionName,
        fields: fields.map(convertField),
    };
}

function convertScholarship(scholarship: RawScholarship): ScholarshipFormDefinition {
    // Group specific fields into a single section
    const specificSection: FormSection = {
        sectionId: 'specific',
        sectionTitle: 'Scholarship-Specific Information',
        fields: scholarship.specificFields.map(convertField),
    };

    const requiredDocs: RequiredDocument[] = (scholarship.requiredDocuments || []).map((doc, index) => ({
        documentId: `${scholarship.scholarshipId}_doc_${index}`,
        documentName: doc.documentName,
        description: doc.description,
        required: doc.required,
    }));

    return {
        scholarshipId: scholarship.scholarshipId,
        scholarshipName: scholarship.scholarshipName,
        formCode: scholarship.formCode,
        revision: scholarship.revision,
        specificFields: [specificSection],
        requiredDocuments: requiredDocs,
    };
}

export function parseFormDefinitions(): ConsolidatedFormDefinitions {
    // Cast the imported JSON to our RawFormData interface
    // Since we unwrapped the file, it matches RawFormData directly
    const data = rawData as unknown as RawFormData;

    // Convert common fields
    const commonSections: FormSection[] = [];
    const commonFieldsData = data.commonFields;

    if (commonFieldsData.personalInformation) {
        commonSections.push(convertSection('personalInformation', commonFieldsData.personalInformation));
    }
    if (commonFieldsData.contactInformation) {
        commonSections.push(convertSection('contactInformation', commonFieldsData.contactInformation));
    }
    if (commonFieldsData.citizenshipAndResidency) {
        commonSections.push(convertSection('citizenshipAndResidency', commonFieldsData.citizenshipAndResidency));
    }
    if (commonFieldsData.postSecondaryEnrolment) {
        commonSections.push(convertSection('postSecondaryEnrolment', commonFieldsData.postSecondaryEnrolment));
    }
    if (commonFieldsData.declaration) {
        commonSections.push(convertSection('declaration', commonFieldsData.declaration));
    }

    return {
        title: 'Alberta Scholarship Application',
        commonFields: {
            sections: commonSections,
        },
        scholarships: data.scholarships.map(convertScholarship),
    };
}
