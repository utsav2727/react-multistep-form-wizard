# Publishing Guide

## Package Overview

Your React multi-step form has been successfully converted into an npm package with the following structure:

### Package Details
- **Name**: `@utsavpatel/multi-step-form`
- **Version**: `1.0.0`
- **Description**: A flexible, customizable multi-step form component for React applications

### Build Output
The package builds to the `dist/` folder with:
- `index.esm.js` - ES modules build
- `index.cjs.js` - CommonJS build
- `index.d.ts` - TypeScript declarations
- `multi-step-form.css` - Stylesheet
- Individual component files with declarations

## Pre-Publishing Checklist

### 1. Test the Package Locally
```bash
# Build the package
npm run build:lib

# Test in a separate project
npm pack
# This creates a .tgz file you can install locally
```

### 2. Verify Package Contents
```bash
# Check what files will be included
npm pack --dry-run
```

### 3. Update Package Information (if needed)
- Update version in `package.json`
- Update repository URL if different
- Update author information if needed

## Publishing Steps

### 1. Login to npm
```bash
npm login
```

### 2. Publish the Package
```bash
npm publish
```

### 3. Verify Publication
- Check npm registry: https://www.npmjs.com/package/@utsavpatel/multi-step-form
- Test installation in a new project

## Usage by Consumers

Users can install and use your package like this:

```bash
npm install @utsavpatel/multi-step-form
```

```tsx
import { MultiStepForm, formSteps } from '@utsavpatel/multi-step-form';
import '@utsavpatel/multi-step-form/dist/multi-step-form.css';

function App() {
  const handleSubmit = (formData) => {
    console.log('Form submitted:', formData);
  };

  return (
    <MultiStepForm 
      formSteps={formSteps} 
      onSubmit={handleSubmit} 
    />
  );
}
```

## Dependencies

### Peer Dependencies (required by users)
- `react` >= 18.0.0
- `react-dom` >= 18.0.0

### Package Dependencies
- `framer-motion` - For animations
- `react-phone-number-input` - For phone number input

### Required by Users
- `tailwindcss` - For styling (users need to install this separately)

## File Structure

```
dist/
├── index.esm.js          # ES modules build
├── index.cjs.js          # CommonJS build
├── index.d.ts            # TypeScript declarations
├── multi-step-form.css   # Stylesheet
├── components/           # Individual component files
│   ├── DynamicFormContainer.d.ts
│   ├── FormContent.d.ts
│   └── FormPage.d.ts
└── config/               # Configuration files
    ├── steps.d.ts
    ├── stepsInterface.d.ts
    └── sampleStepConfig.d.ts
```

## Version Management

To update the package:

1. Update version in `package.json`
2. Update CHANGELOG.md (if you create one)
3. Run `npm run build:lib`
4. Run `npm publish`

## Troubleshooting

### Common Issues

1. **Build fails**: Check Node.js version (requires 20.19+ or 22.12+)
2. **TypeScript errors**: Run `tsc -p tsconfig.lib.json` to check for type errors
3. **Missing styles**: Users need to import the CSS file separately

### Support

- GitHub: https://github.com/utsavpatel/multi-step-form
- Issues: https://github.com/utsavpatel/multi-step-form/issues
- Email: utsavmp1@gmail.com
