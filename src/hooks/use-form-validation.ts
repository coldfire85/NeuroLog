import { useState, useEffect } from 'react';

export type ValidationRule<T> = {
  validate: (value: T, formValues?: Record<string, any>) => boolean;
  message: string;
};

export type ValidationRules<T> = {
  [K in keyof T]?: ValidationRule[];
};

export type ValidationErrors<T> = {
  [K in keyof T]?: string[];
};

export function useFormValidation<T extends Record<string, any>>(
  initialValues: T,
  validationRules: ValidationRules<T>,
  validateOnChange = true
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<ValidationErrors<T>>({});
  const [isDirty, setIsDirty] = useState<Record<keyof T, boolean>>({} as Record<keyof T, boolean>);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValid, setIsValid] = useState(false);

  // Reset form values
  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
    setIsDirty({} as Record<keyof T, boolean>);
    setIsSubmitting(false);
  };

  // Handle input change
  const handleChange = (field: keyof T, value: any) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setIsDirty((prev) => ({ ...prev, [field]: true }));

    if (validateOnChange) {
      validateField(field, value);
    }
  };

  // Validate a single field
  const validateField = (field: keyof T, value: any = values[field]) => {
    const fieldRules = validationRules[field] || [];
    const fieldErrors: string[] = [];

    fieldRules.forEach((rule) => {
      if (!rule.validate(value, values)) {
        fieldErrors.push(rule.message);
      }
    });

    setErrors((prev) => ({
      ...prev,
      [field]: fieldErrors.length > 0 ? fieldErrors : undefined,
    }));

    return fieldErrors.length === 0;
  };

  // Validate all form fields
  const validateForm = () => {
    let isFormValid = true;
    const newErrors: ValidationErrors<T> = {};

    // Mark all fields as dirty
    const newDirty: Record<keyof T, boolean> = {} as Record<keyof T, boolean>;
    Object.keys(values).forEach(key => {
      newDirty[key as keyof T] = true;
    });
    setIsDirty(newDirty);

    // Validate each field
    Object.keys(validationRules).forEach((key) => {
      const field = key as keyof T;
      const fieldRules = validationRules[field] || [];
      const fieldErrors: string[] = [];

      fieldRules.forEach((rule) => {
        if (!rule.validate(values[field], values)) {
          fieldErrors.push(rule.message);
          isFormValid = false;
        }
      });

      if (fieldErrors.length > 0) {
        newErrors[field] = fieldErrors;
      }
    });

    setErrors(newErrors);
    setIsValid(isFormValid);
    return isFormValid;
  };

  // Handle form submission
  const handleSubmit = async (onSubmit: (values: T) => Promise<void> | void) => {
    setIsSubmitting(true);
    const isFormValid = validateForm();

    if (isFormValid) {
      try {
        await onSubmit(values);
      } catch (error) {
        console.error('Form submission error:', error);
      }
    }
    setIsSubmitting(false);
  };

  // Update isValid state when errors change
  useEffect(() => {
    const newIsValid = Object.keys(errors).length === 0;
    setIsValid(newIsValid);
  }, [errors]);

  return {
    values,
    errors,
    isDirty,
    isSubmitting,
    isValid,
    setValues,
    handleChange,
    validateField,
    validateForm,
    handleSubmit,
    resetForm,
  };
}

// Common validation rules
export const validationRules = {
  required: (message = 'This field is required'): ValidationRule<any> => ({
    validate: (value) => {
      if (value === undefined || value === null) return false;
      if (typeof value === 'string') return value.trim() !== '';
      if (Array.isArray(value)) return value.length > 0;
      return true;
    },
    message,
  }),

  minLength: (min: number, message = `Must be at least ${min} characters`): ValidationRule<string> => ({
    validate: (value) => value && value.length >= min,
    message,
  }),

  maxLength: (max: number, message = `Must be ${max} characters or less`): ValidationRule<string> => ({
    validate: (value) => !value || value.length <= max,
    message,
  }),

  email: (message = 'Must be a valid email address'): ValidationRule<string> => ({
    validate: (value) => {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return !value || regex.test(value);
    },
    message,
  }),

  number: (message = 'Must be a number'): ValidationRule<any> => ({
    validate: (value) => !value || !isNaN(Number(value)),
    message,
  }),

  minValue: (min: number, message = `Must be at least ${min}`): ValidationRule<number> => ({
    validate: (value) => !value || value >= min,
    message,
  }),

  maxValue: (max: number, message = `Must be ${max} or less`): ValidationRule<number> => ({
    validate: (value) => !value || value <= max,
    message,
  }),

  pattern: (pattern: RegExp, message = 'Invalid format'): ValidationRule<string> => ({
    validate: (value) => !value || pattern.test(value),
    message,
  }),

  match: (field: string, message = 'Fields do not match'): ValidationRule<any> => ({
    validate: (value, formValues) => !value || !formValues || value === formValues[field],
    message,
  }),
};
