import React from 'react';
import {
    GoabInput,
    GoabDropdown,
    GoabDropdownItem,
    GoabTextArea,
    GoabCheckbox,
    GoabRadioGroup,
    GoabDatePicker,
    GoabFormItem,
} from '@abgov/react-components';
import { FormField, FormFieldValue } from '../../types/formDefinitions';

interface GoabDynamicFormFieldProps {
    field: FormField;
    value: FormFieldValue;
    onChange: (value: any, isValid: boolean) => void;
    showError?: boolean;
}

export function GoabDynamicFormField({
    field,
    value,
    onChange,
    showError = false,
}: GoabDynamicFormFieldProps) {
    const inputValue = value?.value;
    const isInvalid = showError && !value.isValid;

    const handleTextChange = (e: { name: string; value: string }) => {
        const newValue = e.value;
        // Basic validation: checking required
        const isValid = field.required ? newValue.trim() !== '' : true;
        onChange(newValue, isValid);
    };

    const handleSelectChange = (e: { name: string; value: string | string[] }) => {
        // value might be string or array depending on version, safely handle both
        const val = Array.isArray(e.value) ? e.value[0] : e.value;
        const newValue = val || '';
        const isValid = field.required ? newValue !== '' : true;
        onChange(newValue, isValid);
    };

    const handleRadioChange = (e: { name: string; value: string }) => {
        const newValue = e.value;
        const isValid = field.required ? newValue !== '' : true;
        onChange(newValue, isValid);
    }

    const handleDateChange = (e: { name: string; value: Date | undefined }) => {
        const newValue = e.value;
        // Date picker returns Date object or undefined
        // Store as ISO string or whatever your data model expects
        const dateStr = newValue ? newValue.toISOString() : '';
        const isValid = field.required ? !!newValue : true;
        onChange(dateStr, isValid);
    }

    switch (field.dataType) {
        case 'text':
        case 'email':
        case 'phone':
        case 'number':
            return (
                <GoabFormItem label={field.label} helpText={field.helpText} error={isInvalid ? 'This field is required' : ''}>
                    <GoabInput
                        name={field.fieldId}
                        type={field.dataType === 'number' ? 'number' : field.dataType === 'email' ? 'email' : 'text'}
                        value={inputValue as string || ''}
                        onChange={handleTextChange}
                        error={isInvalid}
                        width="100%"
                    />
                </GoabFormItem>
            );

        case 'textarea':
            return (
                <GoabFormItem label={field.label} helpText={field.helpText} error={isInvalid ? 'This field is required' : ''}>
                    <GoabTextArea
                        name={field.fieldId}
                        value={inputValue as string || ''}
                        onChange={handleTextChange}
                        error={isInvalid}
                        width="100%"
                    />
                </GoabFormItem>
            );

        case 'select':
            return (
                <GoabFormItem label={field.label} helpText={field.helpText} error={isInvalid ? 'This field is required' : ''}>
                    <GoabDropdown
                        name={field.fieldId}
                        value={inputValue as string || ''}
                        onChange={handleSelectChange}
                        error={isInvalid}
                        width="100%"
                    >
                        {field.options?.map(opt => (
                            <GoabDropdownItem key={opt.value} value={opt.value} label={opt.label} />
                        ))}
                    </GoabDropdown>
                </GoabFormItem>
            );

        case 'boolean':
            // Mapping boolean to Radio Group (Yes/No)
            return (
                <GoabFormItem label={field.label} helpText={field.helpText} error={isInvalid ? 'Selection is required' : ''}>
                    <GoabRadioGroup
                        name={field.fieldId}
                        value={inputValue as string}
                        onChange={handleRadioChange}
                        error={isInvalid}
                        items={[
                            { value: 'Yes', label: 'Yes' },
                            { value: 'No', label: 'No' }
                        ]}
                    >
                    </GoabRadioGroup>
                </GoabFormItem>
            );

        case 'date':
            return (
                <GoabFormItem label={field.label} helpText={field.helpText} error={isInvalid ? 'Date is required' : ''}>
                    <GoabDatePicker
                        name={field.fieldId}
                        value={inputValue ? new Date(inputValue as string) : undefined}
                        onChange={handleDateChange}
                    />
                </GoabFormItem>
            )

        case 'signature':
            return (
                <GoabFormItem label={field.label} helpText={field.helpText || "Type your full name as signature"} error={isInvalid ? 'Signature is required' : ''}>
                    <GoabInput
                        name={field.fieldId}
                        value={inputValue as string || ''}
                        onChange={handleTextChange}
                        error={isInvalid}
                        width="100%"
                        placeholder="Type full name"
                    />
                </GoabFormItem>
            )

        // TODO: Implement File Upload properly in GoabRequiredDocuments or here if needed
        // For now, simple fallback or unimplemented
        case 'attachment':
            return (
                <GoabFormItem label={field.label} helpText="File upload handled in Required Documents section">
                    <div style={{ padding: '8px', background: '#f0f0f0', borderRadius: '4px' }}>
                        [File Upload Placeholder]
                    </div>
                </GoabFormItem>
            )

        default:
            return null;
    }
}
