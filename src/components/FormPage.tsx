import type { FormStep } from '../config/stepsInterface';
import FormContent from './FormContent'

interface FormData {
    [key: string]: string | string[] | File | File[] | undefined;
    uid?: string;
}

interface FormPageProps {
    formSteps: FormStep[];
    onSubmit: (formData: FormData) => void;
}

const FormPage = ({ formSteps, onSubmit }: FormPageProps) => {

    return (
        <div className="multi-step-form-container">
            <div className="multi-step-form-wrapper">
                <FormContent formSteps={formSteps} submitForm={onSubmit} />
            </div>
        </div>
    )
}

export default FormPage