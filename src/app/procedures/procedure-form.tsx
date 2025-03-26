"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { TemplateSelector } from "./template-selector";
import { FileUpload } from "@/components/file-upload";
import { FileGallery } from "@/components/file-gallery";
import { FileItem, Template, ProcedureData, ProcedureFormValues } from "@/lib/types";
import { AppErrorBoundary } from "@/components/app-error-boundary";
import { BulkMediaUpload } from "@/components/bulk-media-upload"; // Add BulkMediaUpload import at the top with other imports

// Define the schema for our form validation with detailed error messages
const formSchema = z.object({
  patientId: z.string().min(1, "Patient ID is required")
    .regex(/^[A-Za-z0-9-]+$/, "Patient ID can only contain letters, numbers, and hyphens"),

  patientName: z.string().min(2, "Patient name must be at least 2 characters")
    .max(100, "Patient name cannot exceed 100 characters")
    .regex(/^[A-Za-z\s'.-]+$/, "Patient name can only contain letters, spaces, apostrophes, periods, and hyphens"),

  patientAge: z.coerce
    .number()
    .int("Age must be a whole number")
    .positive("Age must be a positive number")
    .max(120, "Age must be less than 120")
    .optional(),

  patientGender: z.string().optional(),

  date: z.date({
    required_error: "Procedure date is required",
    invalid_type_error: "Invalid date format"
  }),

  diagnosis: z.string()
    .min(2, "Diagnosis must be at least 2 characters")
    .max(500, "Diagnosis cannot exceed 500 characters"),

  procedureType: z.string()
    .min(1, "Procedure type is required"),

  surgeonRole: z.string()
    .min(1, "Surgeon role is required"),

  location: z.string()
    .min(2, "Location must be at least 2 characters")
    .max(100, "Location cannot exceed 100 characters"),

  notes: z.string()
    .max(5000, "Notes cannot exceed 5000 characters")
    .optional(),

  complications: z.string()
    .max(1000, "Complications description cannot exceed 1000 characters")
    .optional(),

  outcome: z.string()
    .max(1000, "Outcome description cannot exceed 1000 characters")
    .optional(),

  followUp: z.string()
    .max(1000, "Follow-up plan cannot exceed 1000 characters")
    .optional(),
});

interface ProcedureFormProps {
  procedure?: ProcedureData;
  onSubmit?: (data: ProcedureFormValues, files: { images: FileItem[], videos: FileItem[], radiologyImages: FileItem[] }) => Promise<void>;
  isEdit?: boolean;
}

export function ProcedureForm({
  procedure = null,
  onSubmit,
  isEdit = false
}: ProcedureFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [isSavingTemplate, setIsSavingTemplate] = useState(false);
  const [images, setImages] = useState<FileItem[]>(procedure?.images || []);
  const [videos, setVideos] = useState<FileItem[]>(procedure?.videos || []);
  const [radiologyImages, setRadiologyImages] = useState<FileItem[]>(procedure?.radiologyImages || []);
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const { toast } = useToast();
  const router = useRouter();

  // Process the procedure data for the form
  const processedProcedure = procedure ? {
    ...procedure,
    // Ensure date is a Date object
    date: procedure.date instanceof Date ? procedure.date : new Date(procedure.date || Date.now()),
    // Make sure other fields have default values
    patientId: procedure.patientId || "",
    patientName: procedure.patientName || "",
    patientAge: procedure.patientAge || undefined,
    patientGender: procedure.patientGender || "",
    diagnosis: procedure.diagnosis || "",
    procedureType: procedure.procedureType || "",
    surgeonRole: procedure.surgeonRole || "Lead",
    location: procedure.location || "",
    notes: procedure.notes || "",
    complications: procedure.complications || "",
    outcome: procedure.outcome || "",
    followUp: procedure.followUp || "",
  } : null;

  const form = useForm<ProcedureFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: processedProcedure || {
      patientId: "",
      patientName: "",
      patientAge: undefined,
      patientGender: "",
      date: new Date(),
      diagnosis: "",
      procedureType: "",
      surgeonRole: "Lead",
      location: "",
      notes: "",
      complications: "",
      outcome: "",
      followUp: "",
    },
    mode: "onChange", // Validate fields on change for immediate feedback
  });

  // Check form validation on tab change to guide the user
  const handleTabChange = (value: string) => {
    // Get all errors
    const errors = form.formState.errors;
    const errorFields = Object.keys(errors);

    // Tab-specific fields mapping
    const tabFields = {
      details: ["patientId", "patientName", "patientAge", "patientGender"],
      procedure: ["date", "location", "diagnosis", "procedureType", "surgeonRole"],
      notes: ["notes", "complications", "outcome", "followUp"],
      images: [] // No form fields validation in the media tab
    };

    // If changing to a tab other than the current one
    if (value !== activeTab) {
      // If the current tab has errors, show a toast with the error fields
      const currentTabErrors = errorFields.filter(field =>
        tabFields[activeTab as keyof typeof tabFields].includes(field)
      );

      if (currentTabErrors.length > 0) {
        const errorMessages = currentTabErrors.map(field => {
          const message = errors[field as keyof typeof errors]?.message;
          return message ? message.toString() : `Invalid ${field}`;
        });

        // Show toast with errors if there are any
        if (errorMessages.length > 0) {
          toast({
            title: "Please fix the following errors before proceeding:",
            description: (
              <ul className="list-disc pl-4 mt-2">
                {errorMessages.map((message, i) => (
                  <li key={i}>{message}</li>
                ))}
              </ul>
            ),
            variant: "destructive",
          });

          // Store the form errors for display at the top of the form
          setFormErrors(errorMessages);

          // Don't block tab change, but highlight the errors
          setActiveTab(value);
          return;
        }
      }

      setActiveTab(value);
    }
  };

  async function handleSubmit(values: ProcedureFormValues) {
    setIsSubmitting(true);
    // Reset form errors
    setFormErrors([]);

    try {
      if (onSubmit) {
        // Use the provided onSubmit handler if available
        await onSubmit(values, { images, videos, radiologyImages });
      } else {
        // Default implementation for new procedures
        console.log("Submitting new procedure:", values);
        console.log("Images:", images);
        console.log("Videos:", videos);
        console.log("Radiology Images:", radiologyImages);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        toast({
          title: "Procedure saved",
          description: "The procedure has been successfully saved to your logbook.",
        });

        // In a real app, we would redirect to the procedure detail page
        router.push('/procedures');
      }
    } catch (error) {
      console.error("Error saving procedure:", error);

      // More detailed error handling
      let errorMessage = "There was an error saving the procedure. Please try again.";

      if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });

      // Set form errors
      setFormErrors([errorMessage]);
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleSelectTemplate = (template: Template) => {
    // Update the form fields with the template data
    form.setValue("notes", template.notes);
    form.setValue("complications", template.complications || "");
    form.setValue("outcome", template.outcome || "");
    form.setValue("followUp", template.followUp || "");

    toast({
      title: "Template Applied",
      description: `The "${template.name}" template has been applied.`,
    });
  };

  const handleSaveAsTemplate = async (templateName: string) => {
    try {
      setIsSavingTemplate(true);

      // Get current form values
      const values = form.getValues();

      // Create template data
      const templateData = {
        name: templateName,
        procedureType: values.procedureType,
        notes: values.notes || "",
        complications: values.complications || "",
        outcome: values.outcome || "",
        followUp: values.followUp || "",
      };

      // Call API to save template
      const response = await fetch("/api/templates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(templateData),
      });

      if (!response.ok) {
        throw new Error("Failed to save template");
      }

      return await response.json();
    } finally {
      setIsSavingTemplate(false);
    }
  };

  const handleImageUpload = (fileData: FileItem) => {
    setImages((prev) => [...prev, fileData]);
  };

  const handleVideoUpload = (fileData: FileItem) => {
    setVideos((prev) => [...prev, fileData]);
  };

  const handleRadiologyUpload = (fileData: FileItem) => {
    setRadiologyImages((prev) => [...prev, fileData]);
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveVideo = (index: number) => {
    setVideos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveRadiology = (index: number) => {
    setRadiologyImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleBulkImageUpload = (files: FileItem[]) => { // Add bulk upload handlers
    setImages((prev) => [...prev, ...files]);

    toast({
      title: "Images Uploaded",
      description: `Successfully uploaded ${files.length} images.`,
    });
  };

  const handleBulkRadiologyUpload = (files: FileItem[]) => {
    setRadiologyImages((prev) => [...prev, ...files]);

    toast({
      title: "Radiology Images Uploaded",
      description: `Successfully uploaded ${files.length} radiology images.`,
    });
  };

  return (
    <AppErrorBoundary section="procedure-form">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          {/* Form validation errors summary */}
          {formErrors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
              <h3 className="text-red-800 font-medium mb-2">Please fix the following errors:</h3>
              <ul className="list-disc pl-5 text-red-700 text-sm">
                {formErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="details">Patient Details</TabsTrigger>
              <TabsTrigger value="procedure">Procedure Info</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
              <TabsTrigger value="images">Media</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="patientId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Patient ID</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., P12345" {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter a unique identifier for the patient (letters, numbers, hyphens only).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="patientName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Patient Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Full name" {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter the patient's full name.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="patientAge"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Age"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(value === "" ? undefined : parseInt(value, 10));
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        Enter the patient's age in years.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="patientGender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Select the patient's gender.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </TabsContent>

            <TabsContent value="procedure" className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        Select the date when the procedure was performed.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="Hospital/Facility" {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter the hospital or facility where the procedure was performed.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="diagnosis"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Diagnosis</FormLabel>
                      <FormControl>
                        <Input placeholder="Primary diagnosis" {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter the primary diagnosis that led to this procedure.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="procedureType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Procedure Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Cranial">Cranial</SelectItem>
                          <SelectItem value="Spinal">Spinal</SelectItem>
                          <SelectItem value="Functional">Functional</SelectItem>
                          <SelectItem value="Vascular">Vascular</SelectItem>
                          <SelectItem value="Pediatric">Pediatric</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Select the type of neurosurgical procedure performed.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="surgeonRole"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Role</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Lead">Lead Surgeon</SelectItem>
                          <SelectItem value="Assistant">Assistant Surgeon</SelectItem>
                          <SelectItem value="Observer">Observer</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Select your role in this procedure.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </TabsContent>

            <TabsContent value="notes" className="pt-4">
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-2">
                    <FormLabel className="mb-1">Procedure Notes</FormLabel>
                    <TemplateSelector
                      procedureType={form.watch("procedureType")}
                      onSelectTemplate={handleSelectTemplate}
                      onSaveAsTemplate={handleSaveAsTemplate}
                      disabled={isSubmitting}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            placeholder="Detailed notes about the procedure"
                            className="min-h-[150px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Include relevant clinical information, surgical approach, and findings. {form.watch("notes")?.length || 0}/5000 characters.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="complications"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Complications</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Any complications encountered"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Document any intraoperative or immediate postoperative complications. {field.value?.length || 0}/1000 characters.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="outcome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Outcome</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Immediate post-procedure outcome"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Describe the patient's immediate postoperative status and outcomes. {field.value?.length || 0}/1000 characters.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="followUp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Follow-up Plan</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Follow-up recommendations and plan"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Outline the follow-up plan and timeline for the patient. {field.value?.length || 0}/1000 characters.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </TabsContent>

            <TabsContent value="images" className="pt-4">
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-medium mb-4">Operative Images</h3>

                  {images.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-sm font-medium mb-2">Uploaded Images ({images.length})</h4>
                      <FileGallery
                        files={images}
                        onRemove={handleRemoveImage}
                        editable={!isSubmitting}
                      />
                    </div>
                  )}

                  <div className="mt-4 border rounded-lg p-4 bg-gray-50">
                    <h4 className="text-sm font-medium mb-3">Upload Operative Images</h4>

                    <div className="mb-4">
                      <FileUpload
                        fileType="image"
                        onUploadComplete={handleImageUpload}
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        Upload a single image. JPG, PNG or GIF. Max size 20MB.
                      </p>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <h4 className="text-sm font-medium mb-3">Bulk Upload Option</h4>
                      <BulkMediaUpload
                        onUploadComplete={handleBulkImageUpload}
                        acceptedFileTypes={["image/jpeg", "image/png", "image/gif"]}
                        maxFiles={10}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Operative Videos</h3>

                  {videos.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-sm font-medium mb-2">Uploaded Videos ({videos.length})</h4>
                      <FileGallery
                        files={videos}
                        onRemove={handleRemoveVideo}
                        editable={!isSubmitting}
                      />
                    </div>
                  )}

                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Upload New Video</h4>
                    <FileUpload
                      fileType="video"
                      onUploadComplete={handleVideoUpload}
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      MP4, WEBM, AVI, MOV or MKV. Max size 500MB.
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Radiology Images</h3>

                  {radiologyImages.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-sm font-medium mb-2">Uploaded Radiology Images ({radiologyImages.length})</h4>
                      <FileGallery
                        files={radiologyImages}
                        onRemove={handleRemoveRadiology}
                        editable={!isSubmitting}
                      />
                    </div>
                  )}

                  <div className="mt-4 border rounded-lg p-4 bg-gray-50">
                    <h4 className="text-sm font-medium mb-3">Upload Radiology Images</h4>

                    <div className="mb-4">
                      <FileUpload
                        fileType="radiology"
                        onUploadComplete={handleRadiologyUpload}
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        Upload a single image. DICOM or JPG. Max size 20MB. Use ZIP for DICOM folders.
                      </p>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <h4 className="text-sm font-medium mb-3">Bulk Upload Option</h4>
                      <BulkMediaUpload
                        onUploadComplete={handleBulkRadiologyUpload}
                        acceptedFileTypes={["image/jpeg", "image/png", "image/dicom", "application/zip"]}
                        maxFiles={10}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => window.history.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEdit ? 'Update Procedure' : 'Save Procedure'}
            </Button>
          </div>
        </form>
      </Form>
    </AppErrorBoundary>
  );
}
