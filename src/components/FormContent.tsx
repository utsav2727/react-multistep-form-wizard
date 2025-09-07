import { useState } from "react";
import DynamicFormContainer from "./DynamicFormContainer";
import type { FormStep } from "../config/stepsInterface";

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
            <div className="multi-step-form-sidebar">
                <div className="multi-step-form-steps">
                    {formSteps.map((step, index) => (
                        <div
                            key={step.id}
                            className={`multi-step-form-step ${currentStep === index ? "active" : ""}`}
                        >
                            <span
                                className={`multi-step-form-step-number ${currentStep === index ? "active" : "inactive"}`}
                            >
                                {index + 1}
                            </span>
                            <span className="multi-step-form-step-title">{step.title}</span>
                        </div>
                    ))}
                </div>
            </div>
            <div className="multi-step-form-content">
                <DynamicFormContainer
                    submitForm={submitForm}
                    onStepChange={handleStepChange}
                    currentStep={currentStep}
                    formSteps={formSteps}
                />
            </div>
        </>
    );
}
