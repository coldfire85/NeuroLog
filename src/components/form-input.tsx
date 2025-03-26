"use client";

import React, { forwardRef } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { cn } from "@/lib/utils";

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label: string;
  name: string;
  errors?: string[];
  type?: string;
  required?: boolean;
  multiline?: boolean;
  rows?: number;
  showErrorsOnBlur?: boolean;
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
  helperText?: string;
}

export const FormField = forwardRef<HTMLInputElement | HTMLTextAreaElement, FormFieldProps>(
  (
    {
      label,
      name,
      errors,
      type = "text",
      required = false,
      multiline = false,
      rows = 4,
      showErrorsOnBlur = true,
      className,
      labelClassName,
      inputClassName,
      helperText,
      onChange,
      onBlur,
      ...props
    },
    ref
  ) => {
    const hasErrors = errors && errors.length > 0;
    const id = `form-field-${name}`;

    return (
      <div className={cn("space-y-2", className)}>
        <div className="flex justify-between">
          <Label
            htmlFor={id}
            className={cn(
              "text-sm font-medium",
              hasErrors && "text-destructive",
              labelClassName
            )}
          >
            {label}
            {required && <span className="text-destructive"> *</span>}
          </Label>
        </div>

        {multiline ? (
          <Textarea
            id={id}
            name={name}
            ref={ref as React.Ref<HTMLTextAreaElement>}
            rows={rows}
            className={cn(
              hasErrors && "border-destructive focus-visible:ring-destructive",
              inputClassName
            )}
            aria-invalid={hasErrors}
            aria-describedby={hasErrors ? `${id}-error` : undefined}
            onChange={onChange}
            onBlur={onBlur}
            {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        ) : (
          <Input
            id={id}
            name={name}
            type={type}
            ref={ref as React.Ref<HTMLInputElement>}
            className={cn(
              hasErrors && "border-destructive focus-visible:ring-destructive",
              inputClassName
            )}
            aria-invalid={hasErrors}
            aria-describedby={hasErrors ? `${id}-error` : undefined}
            onChange={onChange}
            onBlur={onBlur}
            {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
          />
        )}

        {helperText && !hasErrors && (
          <p className="text-sm text-muted-foreground">{helperText}</p>
        )}

        {hasErrors && (
          <div id={`${id}-error`} className="text-sm text-destructive">
            {errors.map((error, index) => (
              <div key={index}>{error}</div>
            ))}
          </div>
        )}
      </div>
    );
  }
);

FormField.displayName = "FormField";

interface FormErrorsProps {
  title?: string;
  errors: string[] | Record<string, string[]>;
  className?: string;
}

export const FormErrors = ({ title, errors, className }: FormErrorsProps) => {
  if (!errors || (Array.isArray(errors) && errors.length === 0) ||
      (!Array.isArray(errors) && Object.keys(errors).length === 0)) {
    return null;
  }

  const errorMessages = Array.isArray(errors)
    ? errors
    : Object.values(errors).flatMap((e) => (e || []));

  if (errorMessages.length === 0) return null;

  return (
    <div
      className={cn(
        "bg-destructive/10 border border-destructive rounded-md p-3 my-4",
        className
      )}
    >
      {title && <h5 className="font-medium text-destructive">{title}</h5>}
      <ul className="list-disc pl-5 mt-1 text-sm text-destructive">
        {errorMessages.map((error, index) => (
          <li key={index}>{error}</li>
        ))}
      </ul>
    </div>
  );
};
