// Test TypeScript imports
import { MultiStepForm, formSteps, FormStep, FormField } from 'react-multistep-form-wizard';

console.log('✅ TypeScript imports work!');
console.log('MultiStepForm:', typeof MultiStepForm);
console.log('formSteps:', formSteps.length);
console.log('FormStep type:', typeof formSteps[0]);
console.log('FormField type:', typeof formSteps[0].fields[0]);
