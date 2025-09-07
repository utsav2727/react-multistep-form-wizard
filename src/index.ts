// Main exports for the multi-step form package
export { default as MultiStepForm } from './components/FormPage';

// Export types and interfaces
export type { FormField, FormStep } from './config/stepsInterface';
export type { FormFieldType } from './config/stepsInterface';

export { formStepsSample1, formStepsSample2 } from './config/sampleStepConfig';

// Note: Users need to import the CSS separately
// import 'react-multistep-form-wizard/dist/react-multistep-form-wizard.css';
