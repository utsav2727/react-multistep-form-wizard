import { useState } from "react";
import DynamicFormContainer from "./DynamicFormContainer";

interface FormField {
    name: string;
    label: string;
    type: string;
    required: boolean;
    options?: string[];
    validation?: string;
}

interface FormStep {
    id: number;
    title: string;
    description?: string;
    fields: FormField[];
}

interface FormData {
    [key: string]: string | string[] | File | File[] | undefined;
    uid?: string;
}

interface FormContentProps {
    formSteps: FormStep[];
    submitForm: (formData: FormData) => void;
}

export default function FormContent({
    formSteps,
    submitForm,
}: FormContentProps) {
    const [currentStep, setCurrentStep] = useState(0);

    const handleStepChange = (stepIndex: number) => {
        setCurrentStep(stepIndex);
    };

    return (
        <>
            <div className="rounded-lg bg-blue-600 p-6 text-white md:w-1/4">
                <div className="space-y-4">
                    {formSteps.map((step, index) => (
                        <div
                            key={step.id}
                            className={`flex items-center gap-3 rounded-md p-2 ${currentStep === index ? "bg-blue-700" : ""
                                }`}
                        >
                            <span
                                className={`flex h-8 w-8 items-center justify-center rounded-full ${currentStep === index
                                    ? "bg-white text-blue-600"
                                    : "border-2 border-white"
                                    }`}
                            >
                                {index + 1}
                            </span>
                            <span className="font-medium text-sm">{step.title}</span>
                        </div>
                    ))}
                </div>
            </div>
            <div className="max-h-[100%] overflow-auto p-6 md:w-3/4">
                <DynamicFormContainer
                    submitForm={submitForm}
                    onStepChange={handleStepChange}
                    currentStep={currentStep}
                />
            </div>
        </>
    );
}
