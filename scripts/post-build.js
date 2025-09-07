const fs = require('fs');
const path = require('path');

// Create directories
const distDir = path.join(__dirname, '../dist');
const componentsDir = path.join(distDir, 'components');
const configDir = path.join(distDir, 'config');

if (!fs.existsSync(componentsDir)) {
    fs.mkdirSync(componentsDir, { recursive: true });
}
if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
}

// Create component declaration files
const formPageDts = `import { FormStep } from '../config/stepsInterface';

interface FormData {
    [key: string]: string | string[] | File | File[] | undefined;
    uid?: string;
}

interface FormPageProps {
    formSteps?: FormStep[];
    onSubmit?: (formData: FormData) => void;
}

declare const FormPage: React.FC<FormPageProps>;
export default FormPage;`;

const dynamicFormContainerDts = `import { FormField, FormStep } from '../config/stepsInterface';

interface FormData {
    [key: string]: string | string[] | File | File[] | undefined;
    uid?: string;
}

interface DynamicFormContainerProps {
    submitForm: (formData: FormData) => void;
    onStepChange: (stepNumber: number) => void;
    currentStep: number;
}

declare const DynamicFormContainer: React.FC<DynamicFormContainerProps>;
export default DynamicFormContainer;`;

const formContentDts = `import { FormStep } from '../config/stepsInterface';

interface FormData {
    [key: string]: string | string[] | File | File[] | undefined;
    uid?: string;
}

interface FormContentProps {
    formSteps: FormStep[];
    submitForm: (formData: FormData) => void;
}

declare const FormContent: React.FC<FormContentProps>;
export default FormContent;`;

// Create config declaration files
const stepsInterfaceDts = `export type FormFieldType = 'text'
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
}`;

const stepsDts = `import { FormStep } from './stepsInterface';

export declare const formSteps: FormStep[];`;

const sampleStepConfigDts = `import { FormStep } from './stepsInterface';

export declare const formSteps1: FormStep[];
export declare const formSteps2: FormStep[];`;

// Write files
fs.writeFileSync(path.join(componentsDir, 'FormPage.d.ts'), formPageDts);
fs.writeFileSync(path.join(componentsDir, 'DynamicFormContainer.d.ts'), dynamicFormContainerDts);
fs.writeFileSync(path.join(componentsDir, 'FormContent.d.ts'), formContentDts);
fs.writeFileSync(path.join(configDir, 'stepsInterface.d.ts'), stepsInterfaceDts);
fs.writeFileSync(path.join(configDir, 'steps.d.ts'), stepsDts);
fs.writeFileSync(path.join(configDir, 'sampleStepConfig.d.ts'), sampleStepConfigDts);

// Update main index.d.ts
const mainIndexDts = `// Main exports for the multi-step form package
export { default as MultiStepForm } from './components/FormPage';
export { default as DynamicFormContainer } from './components/DynamicFormContainer';
export { default as FormContent } from './components/FormContent';

// Export types and interfaces
export type { FormField, FormStep } from './config/stepsInterface';
export type { FormFieldType } from './config/stepsInterface';

// Export sample configurations
export { formSteps } from './config/steps';
export { formSteps1, formSteps2 } from './config/sampleStepConfig';`;

fs.writeFileSync(path.join(distDir, 'index.d.ts'), mainIndexDts);


console.log('✅ TypeScript declaration files created successfully!');
