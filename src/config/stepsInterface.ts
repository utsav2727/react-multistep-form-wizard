export type FormFieldType = 'text'
    | 'email'
    | 'password'
    | 'tel'
    | 'number'
    | 'file'
    | 'textarea'
    | 'select'
    | 'singleselect'
    | 'multiselect'
    | 'consent'
    | 'date'
    | 'datetime-local'
    | 'time'
    | 'month';

export interface FormField {
    name: string;
    label: string;
    type: FormFieldType;
    required: boolean;
    options?: string[];
    validation?: string;
}

export interface FormStep {
    id: number;
    title: string;
    description?: string;
    fields: FormField[];
}

