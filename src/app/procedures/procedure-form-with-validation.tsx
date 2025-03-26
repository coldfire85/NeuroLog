"use client";

import React, { useState, useEffect } from "react";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { TemplateSelector } from "./template-selector";
import { FileUpload } from "@/components/file-upload";
import { FileGallery } from "@/components/file-gallery";
import { FileItem, Template, ProcedureData } from "@/lib/types";
import { AppErrorBoundary } from "@/components/app-error-boundary";
import { useFormValidation } from "@/hooks/use-form-validation";
import { FormField, FormErrors } from "@/components/form-input";
import {
  procedureInitialValues,
  procedureValidationRules,
  procedureTypeOptions,
  surgeonRoleOptions,
  genderOptions
} from "./constants/validation";

interface ProcedureFormProps {
  procedure?: Partial<ProcedureData>;
  onSubmit: (values: Partial<ProcedureData>) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  submitButtonText?: string;
}

export function ProcedureFormWithValidation({
  procedure,
  onSubmit,
  onCancel,
  isSubmitting = false,
  submitButtonText = "Save Procedure",
}: ProcedureFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("patient");
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [uploadedImages, setUploadedImages] = useState<FileItem[]>([]);
  const [uploadedVideos, setUploadedVideos] = useState<FileItem[]>([]);
  const [uploadedRadiologyImages, setUploadedRadiologyImages] = useState<FileItem[]>([]);

  // Initialize form validation
  const initialValues = procedure
    ? { ...procedureInitialValues, ...procedure }
    : procedureInitialValues;

  const {
    values,
    errors,
    isDirty,
    isValid,
    setValues,
    handleChange,
    validateField,
    validateForm,
    handleSubmit,
  } = useFormValidation(
    initialValues as ProcedureData,
    procedureValidationRules,
    true // validate on change
  );

  // Initialize file uploads if procedure has them
  useEffect(() => {
    if (procedure) {
      if (procedure.images) setUploadedImages(procedure.images);
      if (procedure.videos) setUploadedVideos(procedure.videos);
      if (procedure.radiologyImages) setUploadedRadiologyImages(procedure.radiologyImages);
    }
  }, [procedure]);

  // Handle template selection
  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);

    // Update form values with template values
    setValues((prevValues) => ({
      ...prevValues,
      procedureType: template.procedureType || prevValues.procedureType,
      notes: template.notes || prevValues.notes,
      complications: template.complications || prevValues.complications,
      outcome: template.outcome || prevValues.outcome,
      followUp: template.followUp || prevValues.followUp,
    }));

    toast({
      title: "Template Applied",
      description: `The "${template.name}" template has been applied.`,
    });
  };

  // Handle date selection
  const handleDateChange = (date: Date | undefined) => {
    handleChange("date", date);
  };

  // Handle file uploads
  const handleImageUpload = (files: FileItem[]) => {
    setUploadedImages(files);
  };

  const handleVideoUpload = (files: FileItem[]) => {
    setUploadedVideos(files);
  };

  const handleRadiologyImageUpload = (files: FileItem[]) => {
    setUploadedRadiologyImages(files);
  };

  // Handle form submission
  const handleFormSubmit = () => {
    handleSubmit(async (formValues) => {
      // Add file uploads to form values
      const submissionValues = {
        ...formValues,
        images: uploadedImages,
        videos: uploadedVideos,
        radiologyImages: uploadedRadiologyImages,
      };

      // Call the provided onSubmit function
      await onSubmit(submissionValues);
    });
  };

  return (
    <AppErrorBoundary section="procedure-form">
      <div className="space-y-8">
        {/* Add a form-wide error display */}
        <FormErrors
          errors={Object.values(errors).flatMap(e => e || [])}
          title="Please correct the following errors:"
        />

        {/* Tabs for different form sections */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="patient">Patient Details</TabsTrigger>
            <TabsTrigger value="procedure">Procedure Details</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>

          {/* Patient Details Tab */}
          <TabsContent value="patient" className="pt-4 space-y-6">
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
              <FormField
                label="Patient ID"
                name="patientId"
                required
                value={values.patientId}
                onChange={(e) => handleChange("patientId", e.target.value)}
                errors={errors.patientId}
              />

              <FormField
                label="Patient Name"
                name="patientName"
                required
                value={values.patientName}
                onChange={(e) => handleChange("patientName", e.target.value)}
                errors={errors.patientName}
              />

              <FormField
                label="Patient Age"
                name="patientAge"
                type="number"
                required
                value={values.patientAge?.toString() || ""}
                onChange={(e) => handleChange("patientAge", parseInt(e.target.value, 10))}
                errors={errors.patientAge}
              />

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Patient Gender<span className="text-destructive"> *</span>
                </label>
                <Select
                  value={values.patientGender}
                  onValueChange={(value) => handleChange("patientGender", value)}
                >
                  <SelectTrigger className={cn(
                    errors.patientGender && "border-destructive focus-visible:ring-destructive"
                  )}>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    {genderOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.patientGender && (
                  <div className="text-sm text-destructive">
                    {errors.patientGender.map((error, i) => (
                      <div key={i}>{error}</div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Procedure Date<span className="text-destructive"> *</span>
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !values.date && "text-muted-foreground",
                        errors.date && "border-destructive focus-visible:ring-destructive"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {values.date ? format(values.date, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={values.date}
                      onSelect={handleDateChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors.date && (
                  <div className="text-sm text-destructive">
                    {errors.date.map((error, i) => (
                      <div key={i}>{error}</div>
                    ))}
                  </div>
                )}
              </div>

              <FormField
                label="Diagnosis"
                name="diagnosis"
                required
                value={values.diagnosis}
                onChange={(e) => handleChange("diagnosis", e.target.value)}
                errors={errors.diagnosis}
              />
            </div>
          </TabsContent>

          {/* Procedure Details Tab */}
          <TabsContent value="procedure" className="pt-4 space-y-6">
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Procedure Type<span className="text-destructive"> *</span>
                </label>
                <Select
                  value={values.procedureType}
                  onValueChange={(value) => handleChange("procedureType", value)}
                >
                  <SelectTrigger className={cn(
                    errors.procedureType && "border-destructive focus-visible:ring-destructive"
                  )}>
                    <SelectValue placeholder="Select procedure type" />
                  </SelectTrigger>
                  <SelectContent>
                    {procedureTypeOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.procedureType && (
                  <div className="text-sm text-destructive">
                    {errors.procedureType.map((error, i) => (
                      <div key={i}>{error}</div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Surgeon Role<span className="text-destructive"> *</span>
                </label>
                <Select
                  value={values.surgeonRole}
                  onValueChange={(value) => handleChange("surgeonRole", value)}
                >
                  <SelectTrigger className={cn(
                    errors.surgeonRole && "border-destructive focus-visible:ring-destructive"
                  )}>
                    <SelectValue placeholder="Select surgeon role" />
                  </SelectTrigger>
                  <SelectContent>
                    {surgeonRoleOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.surgeonRole && (
                  <div className="text-sm text-destructive">
                    {errors.surgeonRole.map((error, i) => (
                      <div key={i}>{error}</div>
                    ))}
                  </div>
                )}
              </div>

              <FormField
                label="Location"
                name="location"
                required
                value={values.location}
                onChange={(e) => handleChange("location", e.target.value)}
                errors={errors.location}
              />
            </div>

            <FormField
              label="Procedure Notes"
              name="notes"
              multiline
              rows={5}
              required
              value={values.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              errors={errors.notes}
              placeholder="Describe the procedure performed, techniques used, and any significant findings..."
            />

            <FormField
              label="Complications"
              name="complications"
              multiline
              rows={3}
              value={values.complications}
              onChange={(e) => handleChange("complications", e.target.value)}
              placeholder="Document any complications that occurred during or after the procedure..."
            />

            <FormField
              label="Outcome"
              name="outcome"
              multiline
              rows={3}
              value={values.outcome}
              onChange={(e) => handleChange("outcome", e.target.value)}
              placeholder="Describe the immediate post-procedure outcome..."
            />

            <FormField
              label="Follow-up Plan"
              name="followUp"
              multiline
              rows={3}
              value={values.followUp}
              onChange={(e) => handleChange("followUp", e.target.value)}
              placeholder="Document follow-up plans, imaging, and appointments..."
            />
          </TabsContent>

          {/* Media Tab */}
          <TabsContent value="media" className="pt-4 space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Operative Images</h3>
              <FileUpload
                accept="image/*"
                maxSize={20}
                multiple
                onFilesChange={handleImageUpload}
                initialFiles={uploadedImages}
              />

              {uploadedImages.length > 0 && (
                <FileGallery files={uploadedImages} editable={true} onChange={handleImageUpload} />
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Operative Videos</h3>
              <FileUpload
                accept="video/*"
                maxSize={500}
                multiple
                onFilesChange={handleVideoUpload}
                initialFiles={uploadedVideos}
              />

              {uploadedVideos.length > 0 && (
                <FileGallery files={uploadedVideos} editable={true} onChange={handleVideoUpload} />
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Radiology Images</h3>
              <FileUpload
                accept="image/*"
                maxSize={20}
                multiple
                onFilesChange={handleRadiologyImageUpload}
                initialFiles={uploadedRadiologyImages}
              />

              {uploadedRadiologyImages.length > 0 && (
                <FileGallery files={uploadedRadiologyImages} editable={true} onChange={handleRadiologyImageUpload} />
              )}
            </div>
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates" className="pt-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Select a Template</h3>
                <p className="text-sm text-muted-foreground">
                  Choose a template to pre-fill procedure information.
                </p>
              </div>

              <TemplateSelector onSelect={handleTemplateSelect} selectedTemplate={selectedTemplate} />

              {selectedTemplate && (
                <div className="bg-muted p-4 rounded-md mt-4">
                  <h4 className="font-medium">Template Preview: {selectedTemplate.name}</h4>
                  <p className="text-sm text-muted-foreground mt-1">The following fields will be pre-filled:</p>

                  <div className="mt-2 space-y-2">
                    <div>
                      <div className="text-sm font-medium">Procedure Type</div>
                      <div className="text-sm">{selectedTemplate.procedureType}</div>
                    </div>

                    <div>
                      <div className="text-sm font-medium">Notes</div>
                      <div className="text-sm line-clamp-3">{selectedTemplate.notes}</div>
                    </div>

                    {selectedTemplate.complications && (
                      <div>
                        <div className="text-sm font-medium">Complications</div>
                        <div className="text-sm line-clamp-2">{selectedTemplate.complications}</div>
                      </div>
                    )}

                    {selectedTemplate.outcome && (
                      <div>
                        <div className="text-sm font-medium">Outcome</div>
                        <div className="text-sm line-clamp-2">{selectedTemplate.outcome}</div>
                      </div>
                    )}

                    {selectedTemplate.followUp && (
                      <div>
                        <div className="text-sm font-medium">Follow-up</div>
                        <div className="text-sm line-clamp-2">{selectedTemplate.followUp}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Form Actions */}
        <div className="flex justify-end gap-2">
          {onCancel && (
            <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
              Cancel
            </Button>
          )}

          <Button
            onClick={handleFormSubmit}
            disabled={isSubmitting || (Object.keys(errors).length > 0 && Object.values(isDirty).some(Boolean))}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {submitButtonText}
          </Button>
        </div>
      </div>
    </AppErrorBoundary>
  );
}
