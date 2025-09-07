import { formStepsSample1 } from '../config/sampleStepConfig';
import FormContent from './FormContent'

interface FormData {
    [key: string]: string | string[] | File | File[] | undefined;
    uid?: string;
}
const FormPage = () => {

    const onSubmit = (formData: FormData) => {
        console.log('submitted', formData);
        alert("Data is submitted successfully!");
        location.reload();
    }

    return (
        <div className="multi-step-form-container">
            <div className="multi-step-form-wrapper">
                <FormContent formSteps={formStepsSample1} submitForm={onSubmit} />
            </div>
        </div>
    )
}

export default FormPage