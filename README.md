# Multi-Step Form React Component

A flexible, customizable multi-step form component for React applications built with TypeScript, Tailwind CSS, and Framer Motion.

## Features

- 🚀 **Multi-step form navigation** with progress indicator
- 🎨 **Beautiful UI** with Tailwind CSS styling
- 📱 **Responsive design** that works on all devices
- ⚡ **Smooth animations** powered by Framer Motion
- 🔧 **Highly customizable** with configurable form steps
- 📝 **Multiple field types** including text, email, phone, file uploads, selects, and more
- ✅ **Built-in validation** with custom validation rules
- 📋 **Review step** to show all entered data before submission
- 🎯 **TypeScript support** with full type definitions
- 📦 **Zero dependencies** (except React peer dependencies)

## Installation

```bash
npm install @utsavpatel/multi-step-form
```

## Quick Start

```tsx
import React from 'react';
import { MultiStepForm, formSteps } from '@utsavpatel/multi-step-form';
import '@utsavpatel/multi-step-form/dist/styles.css';

function App() {
  const handleSubmit = (formData) => {
    console.log('Form submitted:', formData);
    // Handle form submission
  };

  return (
    <div>
      <MultiStepForm 
        formSteps={formSteps} 
        onSubmit={handleSubmit} 
      />
    </div>
  );
}

export default App;
```

## Basic Usage

### 1. Import the component and styles

```tsx
import { MultiStepForm } from '@utsavpatel/multi-step-form';
import '@utsavpatel/multi-step-form/dist/styles.css';
```

### 2. Define your form steps

```tsx
import { FormStep } from '@utsavpatel/multi-step-form';

const myFormSteps: FormStep[] = [
  {
    id: 1,
    title: "Personal Information",
    description: "Please provide your personal details",
    fields: [
      {
        name: "firstName",
        label: "First Name",
        type: "text",
        required: true,
      },
      {
        name: "email",
        label: "Email Address",
        type: "email",
        required: true,
      },
      {
        name: "phone",
        label: "Phone Number",
        type: "tel",
        required: true,
      },
    ],
  },
  {
    id: 2,
    title: "Preferences",
    description: "Tell us about your preferences",
    fields: [
      {
        name: "interests",
        label: "Your Interests",
        type: "multiselect",
        required: true,
        options: ["Technology", "Sports", "Music", "Art", "Travel"],
      },
      {
        name: "experience",
        label: "Years of Experience",
        type: "singleselect",
        required: true,
        options: ["0-1 years", "2-5 years", "5+ years"],
      },
    ],
  },
];
```

### 3. Use the component

```tsx
function MyForm() {
  const handleSubmit = (formData) => {
    console.log('Form data:', formData);
    // Process the form data
  };

  return (
    <MultiStepForm 
      formSteps={myFormSteps} 
      onSubmit={handleSubmit} 
    />
  );
}
```

## Field Types

The component supports various field types:

### Text Fields
- `text` - Basic text input
- `email` - Email input with validation
- `password` - Password input
- `tel` - Phone number input (with international support)
- `number` - Numeric input
- `textarea` - Multi-line text input
- `date` - Date picker
- `datetime-local` - Date and time picker
- `time` - Time picker
- `month` - Month picker

### Selection Fields
- `select` - Button-style selection
- `singleselect` - Radio button selection
- `multiselect` - Checkbox selection
- `consent` - Checkbox for terms/agreements

### File Fields
- `file` - File upload with drag & drop support

## Advanced Configuration

### Conditional Fields

You can make fields conditional using the `validation` property:

```tsx
{
  name: "salary",
  label: "Annual Salary",
  type: "number",
  required: false,
  validation: "formData['employmentType'] && formData['employmentType'] === 'Full-time'"
}
```

### Custom Validation

The component includes built-in validation for:
- Required fields
- Email format validation
- Phone number validation

### File Upload

File uploads are supported with drag & drop functionality:

```tsx
{
  name: "documents",
  label: "Upload Documents",
  type: "file",
  required: false,
}
```

## Styling

The component uses Tailwind CSS classes. You can customize the appearance by:

1. **Using CSS custom properties** to override colors
2. **Extending Tailwind classes** in your project
3. **Providing custom CSS** to override specific styles

### Custom CSS Example

```css
/* Override the primary color */
.multi-step-form-button.primary {
  background-color: #your-color;
}

/* Custom step indicator */
.multi-step-form-step-number.active {
  background-color: #your-color;
}
```

## API Reference

### MultiStepForm Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `formSteps` | `FormStep[]` | Yes | Array of form steps configuration |
| `onSubmit` | `(formData: FormData) => void` | Yes | Callback function when form is submitted |

### FormStep Interface

```tsx
interface FormStep {
  id: number;
  title: string;
  description?: string;
  fields: FormField[];
}
```

### FormField Interface

```tsx
interface FormField {
  name: string;
  label: string;
  type: FormFieldType;
  required: boolean;
  options?: string[];
  validation?: string;
}
```

### FormFieldType

```tsx
type FormFieldType = 
  | 'text'
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
```

## Sample Configurations

The package includes sample configurations you can use as starting points:

```tsx
import { formSteps, formSteps1, formSteps2 } from '@utsavpatel/multi-step-form';

// Use predefined configurations
<MultiStepForm formSteps={formSteps} onSubmit={handleSubmit} />
```

## Development

### Building the Package

```bash
# Build the library
npm run build:lib

# Development mode
npm run dev
```

### Testing

```bash
# Run linting
npm run lint
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you have any questions or need help, please:

1. Check the [documentation](https://github.com/utsavpatel/multi-step-form#readme)
2. Search [existing issues](https://github.com/utsavpatel/multi-step-form/issues)
3. Create a [new issue](https://github.com/utsavpatel/multi-step-form/issues/new)

## Changelog

### 1.0.0
- Initial release
- Multi-step form with progress indicator
- Support for various field types
- Built-in validation
- Responsive design
- TypeScript support