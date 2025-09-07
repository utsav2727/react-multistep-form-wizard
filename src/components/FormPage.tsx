import { formSteps } from '../config/steps'
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
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-indigo-100 to-blue-200 p-4">
            <div className="flex w-full flex-col gap-6 rounded-xl bg-white p-6 shadow-xl md:h-[90vh] md:max-w-6xl md:flex-row">
                <FormContent formSteps={formSteps} submitForm={onSubmit} />
            </div>
        </div>
    )
}

export default FormPage