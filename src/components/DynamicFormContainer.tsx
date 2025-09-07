import { motion } from "framer-motion";
import type { ChangeEvent } from "react";
import { useState } from "react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import type { FormField, FormStep } from "../config/stepsInterface";

interface FormData {
    [key: string]: string | string[] | File | File[] | undefined;
    uid?: string;
}

interface FormErrors {
    [key: string]: string;
}

interface DynamicFormContainerProps {
    submitForm: (formData: FormData) => void;
    onStepChange: (stepNumber: number) => void;
    currentStep: number;
    formSteps: FormStep[];
}

interface UploadResult {
    success: boolean;
    fileUrl?: string;
    error?: string;
}
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const validators = {
    email: (value: string): boolean => {
        return emailRegex.test(value);
    },
    phone: (value: string): boolean => {
        // const phoneRegex = /^\d{6s,}$/; // Ensures at least 5 digits
        return value.trim() !== "";
    },
};

const DynamicFormContainer = ({
    submitForm,
    currentStep,
    onStepChange,
    formSteps
}: DynamicFormContainerProps) => {
    const [formData, setFormData] = useState<FormData>({});
    const [errors, setErrors] = useState<FormErrors>({});
    const [showMore, setShowMore] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<{ [key: string]: string }>(
        {}
    );

    // Check if the current step contains both email and phone fields
    const isRegistrationStep = (): boolean => {
        const currentFields = formSteps[currentStep].fields.map(
            (field) => field.name
        );
        return currentFields.includes("email") && currentFields.includes("phone");
    };


    const uploadToS3 = async (
        file: File,
        fieldName: string,
        uid: string
    ): Promise<UploadResult> => {
        try {
            setUploadStatus((prev) => ({ ...prev, [fieldName]: "uploading" }));

            // Create a form data object to send the file
            const formDataForUpload = new FormData();
            formDataForUpload.append("file", file);
            formDataForUpload.append("uid", uid);
            formDataForUpload.append("fieldName", fieldName);

            // Replace with your API endpoint for S3 uploads
            const response = await fetch("/api/upload-to-s3", {
                method: "POST",
                body: formDataForUpload,
            });

            const result = await response.json();

            if (result.success) {
                setUploadStatus((prev) => ({ ...prev, [fieldName]: "success" }));
                return {
                    success: true,
                    fileUrl: result.fileUrl,
                };
            }

            setUploadStatus((prev) => ({ ...prev, [fieldName]: "error" }));
            return {
                success: false,
                error: result.error || "Upload failed",
            };
        } catch (error) {
            console.error(`Error uploading ${fieldName}:`, error);
            setUploadStatus((prev) => ({ ...prev, [fieldName]: "error" }));
            return {
                success: false,
                error: "Upload failed due to a network error",
            };
        }
    };

    const validateField = (name: string, value: string): string => {
        if (
            !value &&
            formSteps[currentStep].fields.find((f) => f.name === name)?.required
        ) {
            return `${name} is required`;
        }

        if (!value) return "";

        switch (name) {
            case "email":
                return validators.email(value)
                    ? ""
                    : "Please enter a valid email address";
            case "phone":
                return validators.phone(value.replace(/\D/g, ""))
                    ? ""
                    : "Please enter a valid phone number";
            default:
                return "";
        }
    };

    const handleInputChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        fieldName: string
    ): void => {
        const value = e.target.value;
        setFormData((prev) => ({
            ...prev,
            [fieldName]: value,
        }));
    };

    const handleInputChange2 = (fieldName: string, value: string): void => {
        setFormData((prev) => ({
            ...prev,
            [fieldName]: value,
        }));
    };

    const [uploadedFiles, setUploadedFiles] = useState<{ [key: string]: File[] }>(
        {}
    );

    const handleFileChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        fieldName: string
    ) => {
        if (e.target.files?.length) {
            const files = Array.from(e.target.files);
            setUploadedFiles((prev) => ({
                ...prev,
                [fieldName]: [...(prev[fieldName] || []), ...files],
            }));

            // Store the files in formData
            setFormData((prev) => ({
                ...prev,
                [fieldName]: files,
            }));

            // If user is registered and we have a UID, upload the files immediately
            if (formData.uid) {
                for (const file of files) {
                    uploadToS3(file, fieldName, formData.uid as string).then((result) => {
                        if (result.success && result.fileUrl) {
                            setFormData((prev) => {
                                const existingUrls = Array.isArray(prev[`${fieldName}_urls`])
                                    ? (prev[`${fieldName}_urls`] as string[])
                                    : [];

                                return {
                                    ...prev,
                                    [`${fieldName}_urls`]: [
                                        ...existingUrls,
                                        result.fileUrl,
                                    ].filter(Boolean) as string[], // Ensure valid type
                                };
                            });
                        } else {
                            setErrors((prev) => ({
                                ...prev,
                                [fieldName]: result.error || "Failed to upload file",
                            }));
                        }
                    });
                }
            }
        }
    };

    const removeFile = (fieldName: string, fileIndex: number) => {
        setUploadedFiles((prev) => {
            const updatedFiles = [...(prev[fieldName] || [])];
            updatedFiles.splice(fileIndex, 1);
            return {
                ...prev,
                [fieldName]: updatedFiles,
            };
        });

        // Also update the formData
        setFormData((prev) => {
            const files = Array.isArray(prev[fieldName])
                ? (prev[fieldName] as File[])
                : [];
            const updatedFiles = [...files];
            updatedFiles.splice(fileIndex, 1);

            // Also update URLs if they exist
            const urlsKey = `${fieldName}_urls`;
            let updatedUrls = (prev[urlsKey] as string[]) || [];
            if (updatedUrls.length > fileIndex) {
                updatedUrls = [...updatedUrls];
                updatedUrls.splice(fileIndex, 1);
            }

            return {
                ...prev,
                [fieldName]: updatedFiles,
                [urlsKey]: updatedUrls,
            };
        });
    };

    const handleInputBlur = (fieldName: string, value: string): void => {
        const error = validateField(fieldName, value);
        setErrors((prev) => ({
            ...prev,
            [fieldName]: error,
        }));
    };

    const handleOptionSelect = (fieldName: string, value: string): void => {
        setFormData((prev) => ({
            ...prev,
            [fieldName]: value,
        }));
    };

    const handleOptionSelectArray = (fieldName: string, value: string): void => {
        setFormData((prev) => {
            const prevValues = Array.isArray(prev[fieldName])
                ? (prev[fieldName] as string[])
                : [];
            const updatedValues = prevValues.includes(value)
                ? prevValues.filter((item) => item !== value)
                : [...prevValues, value];

            return {
                ...prev,
                [fieldName]: updatedValues,
            };
        });
    };

    const validateStep = (): boolean => {
        const currentFields = formSteps[currentStep].fields;
        const newErrors: FormErrors = {};
        let isValid = true;

        for (const field of currentFields) {
            const isVisible =
                field.validation === undefined ||
                // biome-ignore lint/security/noGlobalEval: Using eval() for dynamic validation logic
                (field.validation !== null && eval(field.validation) === true);

            if (isVisible && field.required) {
                const value = formData[field.name];
                if (
                    !value ||
                    (typeof value === "string" && value.trim() === "") ||
                    (Array.isArray(value) && value.length === 0)
                ) {
                    newErrors[field.name] = `${field.label} is required`;
                    isValid = false;
                } else if (typeof value === "string") {
                    const error = validateField(field.name, value);
                    if (error) {
                        newErrors[field.name] = error;
                        isValid = false;
                    }
                }
            }
        }

        setErrors(newErrors);
        return isValid;
    };

    // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: <explanation>
    const handleNext = async (): Promise<void> => {
        if (validateStep()) {
            // Check if this is the registration step with email and phone
            onStepChange(Math.min(currentStep + 1, formSteps.length - 1));
        }
    };

    const handlePrev = (): void => {
        onStepChange(Math.max(currentStep - 1, 0));
    };

    // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: <explanation>
    const handleSubmit = async (): Promise<void> => {
        if (validateStep()) {
            try {
                setIsSubmitting(true);

                // Upload any pending files if user is registered
                if (formData.uid) {
                    // Process all file fields
                    for (const [fieldName, files] of Object.entries(uploadedFiles)) {
                        if (Array.isArray(files) && files.length > 0) {
                            const fileUploadPromises = files.map((file) =>
                                // Check if this file has already been uploaded
                                uploadToS3(file, fieldName, formData.uid as string).then(
                                    (result) => {
                                        if (result.success && result.fileUrl) {
                                            // Update form data with file URL
                                            setFormData((prev) => {
                                                const existingUrls = Array.isArray(
                                                    prev[`${fieldName}_urls`]
                                                )
                                                    ? (prev[`${fieldName}_urls`] as string[])
                                                    : [];
                                                return {
                                                    ...prev,
                                                    [`${fieldName}_urls`]: [
                                                        ...existingUrls,
                                                        result.fileUrl,
                                                    ] as string[], // Explicit assertion
                                                };
                                            });
                                        }
                                        return result;
                                    }
                                )
                            );

                            // Wait for all uploads to complete
                            const uploadResults = await Promise.all(fileUploadPromises);

                            // Check if any uploads failed
                            const failedUploads = uploadResults.filter(
                                (result) => !result.success
                            );
                            if (failedUploads.length > 0) {
                                alert(
                                    `${failedUploads.length} file(s) failed to upload. Please try again.`
                                );
                                // return;
                            }
                        }
                    }
                }

                // Prepare final form data for submission
                const formDataForSubmit = { ...formData };

                // Remove actual File objects as they can't be sent via server actions
                for (const key of Object.keys(formDataForSubmit)) {
                    if (
                        Array.isArray(formDataForSubmit[key]) &&
                        formDataForSubmit[key][0] instanceof File
                    ) {
                        // Make sure we keep the URLs of the files
                        // biome-ignore lint/nursery/useCollapsedIf: <explanation>
                        if (!formDataForSubmit[`${key}_urls`]) {
                            delete formDataForSubmit[key];
                        }
                    }
                }

                submitForm(formDataForSubmit);
            } catch (error) {
                console.error("Error submitting form:", error);
                alert("An error occurred while submitting the form.");
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const renderFileUploadField = (field: FormField) => (
        <div className="multi-step-form-file-container">
            <div className="multi-step-form-file-upload">
                <input
                    type="file"
                    id={field.name}
                    name={field.name}
                    required={field.required}
                    onChange={(e) => handleFileChange(e, field.name)}
                    accept=".png,.jpg,.jpeg"
                    className="multi-step-form-file-input"
                    multiple
                />
                <label
                    htmlFor={field.name}
                    className="multi-step-form-file-label"
                >
                    <svg
                        className="multi-step-form-file-icon"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <title id="svg-title">.</title>
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M7 16V12m0 0V8m0 4h10m-5-8a4 4 0 00-4 4v1a4 4 0 004 4h5a4 4 0 004-4V7a4 4 0 00-4-4h-5z"
                        />
                    </svg>
                    <span className="multi-step-form-file-text">
                        Drag & drop or browse to upload multiple files
                    </span>
                    <span className="multi-step-form-file-subtext">
                        (PNG, JPG up to 5MB each)
                    </span>
                </label>
            </div>

            {/* Display uploaded files list */}
            {uploadedFiles[field.name] && uploadedFiles[field.name].length > 0 && (
                <div className="multi-step-form-file-list">
                    <h4 className="multi-step-form-file-list-title">Uploaded files:</h4>
                    <ul className="multi-step-form-file-list-container">
                        {uploadedFiles[field.name].map((file, index) => (
                            <li
                                key={index}
                                className="multi-step-form-file-item"
                            >
                                <div className="multi-step-form-file-item-content">
                                    <div className="multi-step-form-file-item-icon">
                                        <svg
                                            className="multi-step-form-file-icon-small"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <title id="svg-title">.</title>
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                            />
                                        </svg>
                                    </div>
                                    <span className="multi-step-form-file-name">
                                        {file.name}
                                    </span>
                                    <span className="multi-step-form-file-size">
                                        ({(file.size / 1024).toFixed(0)} KB)
                                    </span>
                                </div>

                                <div className="multi-step-form-file-item-status">
                                    {uploadStatus[`${field.name}_${index}`] === "uploading" && (
                                        <span className="multi-step-form-status uploading">
                                            Uploading...
                                        </span>
                                    )}
                                    {uploadStatus[`${field.name}_${index}`] === "success" && (
                                        <span className="multi-step-form-status success">
                                            ✓ Uploaded
                                        </span>
                                    )}
                                    {uploadStatus[`${field.name}_${index}`] === "error" && (
                                        <span className="multi-step-form-status error">Failed</span>
                                    )}

                                    <button
                                        onClick={() => removeFile(field.name, index)}
                                        className="multi-step-form-remove-button"
                                        type="button"
                                    >
                                        <svg
                                            className="multi-step-form-remove-icon"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <title>.</title>
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );

    const MAX_VISIBLE_OPTIONS = 10;

    const renderField = (field: FormField) => {
        if (field.type === "select") {
            return (
                <div className="multi-step-form-select-grid">
                    {field.options?.map((option) => (
                        <motion.button
                            key={option}
                            onClick={() => handleOptionSelect(field.name, option)}
                            className={`multi-step-form-select-button ${formData[field.name] === option
                                ? "selected"
                                : "unselected"
                                }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {option}
                        </motion.button>
                    ))}
                </div>
            );
        }

        if (field.type === "consent" || field.type === "multiselect") {
            return (
                <div>
                    {
                        field.validation === undefined ||
                            (field.validation != null && eval(field.validation)) ? (
                            <fieldset className="multi-step-form-fieldset">
                                <div
                                    className={`multi-step-form-grid ${field.type === "multiselect" ? "multi-step-form-grid-cols-2" : ""}`}
                                >
                                    {field.options
                                        ?.slice(
                                            0,
                                            showMore ? field.options.length : MAX_VISIBLE_OPTIONS
                                        )
                                        .map((option) => (
                                            <label
                                                key={option}
                                                className="multi-step-form-radio-group"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={
                                                        (formData[field.name] as string[])?.includes(
                                                            option
                                                        ) || false
                                                    }
                                                    onChange={() =>
                                                        handleOptionSelectArray(field.name, option)
                                                    }
                                                    className="multi-step-form-checkbox"
                                                />
                                                <span className="multi-step-form-checkbox-label">
                                                    {option}
                                                </span>
                                            </label>
                                        ))}
                                </div>
                                {field.options &&
                                    field.options.length > MAX_VISIBLE_OPTIONS && (
                                        <button
                                            type="button"
                                            onClick={() => setShowMore(!showMore)}
                                            className="multi-step-form-show-more"
                                        >
                                            {showMore
                                                ? "Show Less"
                                                : `+ ${field.options.length - MAX_VISIBLE_OPTIONS} More Choices`}
                                        </button>
                                    )}
                            </fieldset>
                        ) : null
                    }
                </div>
            );
        }

        if (field.type === "singleselect") {
            return (
                <fieldset className="multi-step-form-flex-list">
                    {field.options?.map((option) => (
                        <label
                            key={option}
                        >
                            <input
                                type="radio"
                                name={field.name}
                                value={option}
                                checked={formData[field.name] === option}
                                onChange={() => handleOptionSelect(field.name, option)}
                                className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-gray-800">{option}</span>
                        </label>
                    ))}
                </fieldset>
            );
        }

        if (field.type === "tel") {
            return (
                <PhoneInput
                    defaultCountry="US"
                    value={(formData[field.name] as string) || ""}
                    onChange={(value) => handleInputChange2(field.name, value || "")}
                    className="multi-step-form-input"
                />
            );
        }

        if (field.type === "file") {
            return renderFileUploadField(field);
        }

        if (field.type === "textarea") {
            return (
                <textarea
                    value={(formData[field.name] as string) || ""}
                    onChange={(e) => handleInputChange(e, field.name)}
                    onBlur={(e) => handleInputBlur(field.name, e.target.value)}
                    className={`multi-step-form-textarea ${errors[field.name] ? "error" : ""}`}
                    placeholder={`Enter your ${field.label.toLowerCase()}`}
                />
            );
        }

        return (
            <input
                type={field.type}
                value={(formData[field.name] as string) || ""}
                onChange={(e) => handleInputChange(e, field.name)}
                onBlur={(e) => handleInputBlur(field.name, e.target.value)}
                className={`multi-step-form-input ${errors[field.name] ? "error" : ""}`}
                placeholder={`Enter your ${field.label.toLowerCase()}`}
            />
        );
    };

    const renderReview = (formStep: FormStep) => {
        const formatValue = (
            value: string | File | File[] | string[] | undefined
        ) => {
            if (Array.isArray(value)) {
                return value
                    .map((item) => (item instanceof File ? item.name : item))
                    .join(", ");
            }

            if (value instanceof File) {
                return value.name;
            }

            return value;
        };

        const excludedKeys = [
            "Terms and Conditions",
            "Consent to Receive and Send SMS Communications",
            "Consent to Receive and Send Email Communications",
        ];

        if (formStep.title === "Review & Submit") {
            return (
                <div className="multi-step-form-review">
                    <table className="multi-step-form-review-table">
                        <thead>
                            <tr className="multi-step-form-review-header">
                                <th className="multi-step-form-review-cell header">
                                    Field
                                </th>
                                <th className="multi-step-form-review-cell header">
                                    Value
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(formData)
                                .filter(([key]) => !excludedKeys.includes(key))
                                .map(([key, value]) => (
                                    <tr key={key} className="border border-gray-300">
                                        <td className="multi-step-form-review-cell">
                                            {key.replace(/_/g, " ")}
                                        </td>
                                        <td className="multi-step-form-review-cell">
                                            {formatValue(value)}
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            );
        }
    };

    console.log("formData", formData);

    return (
        <motion.div
            key={currentStep}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            className="space-y-6"
        >
            <h2 className="font-bold text-3xl text-gray-800">
                {formSteps[currentStep].title}
            </h2>
            <h4>{formSteps[currentStep].description}</h4>

            {errors.registration && (
                <div className="mb-4 rounded-md bg-red-100 p-3 text-red-700">
                    {errors.registration}
                </div>
            )}

            <div className="space-y-4">
                {/* {console.log("currentStep", formSteps[currentStep])} */}
                {renderReview(formSteps[currentStep])}

                {formSteps[currentStep].fields.map((field) => (
                    <div key={field.name} className="multi-step-form-input-box">
                        {(field.validation === undefined ||
                            (field.validation != null &&
                                // biome-ignore lint/security/noGlobalEval: using for dynamic validation
                                eval(field.validation) &&
                                // biome-ignore lint/security/noGlobalEval: using for dynamic validation
                                eval(field.validation) === true)) && (
                                <div>
                                    <div className="block font-medium text-gray-700">
                                        {field.label}
                                        {field.required && (
                                            <span className="ml-1 text-red-500">*</span>
                                        )}
                                    </div>
                                    {renderField(field)}

                                    {errors[field.name] && (
                                        <span className="multi-step-form-error">
                                            {errors[field.name]}
                                        </span>
                                    )}
                                </div>
                            )}
                    </div>
                ))}
            </div>

            <div className="multistep-navigation-button">
                {currentStep > 0 && (
                    <motion.button
                        onClick={handlePrev}
                        className="multi-step-form-button prev"
                        whileTap={{ scale: 0.98 }}
                        disabled={isSubmitting}
                    >
                        ← Back
                    </motion.button>
                )}

                {currentStep === formSteps.length - 1 ? (
                    <motion.button
                        onClick={handleSubmit}
                        className="multi-step-form-button submit"
                        whileTap={{ scale: 0.98 }}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Submitting..." : "Submit"}
                    </motion.button>
                ) : (
                    <motion.button
                        onClick={handleNext}
                        className="multi-step-form-button next"
                        whileTap={{ scale: 0.98 }}
                        disabled={isSubmitting}
                    >
                        {isSubmitting && isRegistrationStep()
                            ? "Registering..."
                            : "Next →"}
                    </motion.button>
                )}
            </div>
        </motion.div>
    );
};

export default DynamicFormContainer;
