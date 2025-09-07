// Main exports for the multi-step form package
export { default as MultiStepForm } from './components/FormPage';
export { default as DynamicFormContainer } from './components/DynamicFormContainer';
export { default as FormContent } from './components/FormContent';

// Export types and interfaces
export type { FormField, FormStep } from './config/stepsInterface';
export type { FormFieldType } from './config/stepsInterface';

// Export sample configurations
export { formSteps } from './config/steps';
export { formSteps1, formSteps2 } from './config/sampleStepConfig';

// Note: Users need to import the CSS separately
// import 'react-multistep-form-wizard/dist/react-multistep-form-wizard.css';
