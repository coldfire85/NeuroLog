"use client";

import { useState, useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check, ChevronsUpDown, FilePlus2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Template } from "@/lib/types";

interface TemplateSelectorProps {
  procedureType: string;
  onSelectTemplate: (template: Template) => void;
  onSaveAsTemplate: (templateName: string) => Promise<void>;
  disabled?: boolean;
}

export function TemplateSelector({
  procedureType,
  onSelectTemplate,
  onSaveAsTemplate,
  disabled = false
}: TemplateSelectorProps) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [saveOpen, setSaveOpen] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      async function fetchTemplates() {
        try {
          setIsLoading(true);
          const response = await fetch("/api/templates");

          if (!response.ok) {
            throw new Error("Failed to fetch templates");
          }

          const data = await response.json();

          // Filter by procedure type if one is selected
          let filteredTemplates = data.templates;
          if (procedureType) {
            filteredTemplates = data.templates.filter(
              (template: Template) => template.procedureType === procedureType
            );
          }

          setTemplates(filteredTemplates);
        } catch (error) {
          console.error("Error fetching templates:", error);
          toast({
            title: "Error",
            description: "Could not load templates. Please try again.",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      }

      fetchTemplates();
    }
  }, [open, procedureType, toast]);

  const handleSaveTemplate = async () => {
    if (!templateName.trim()) {
      toast({
        title: "Error",
        description: "Template name is required",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSaving(true);
      await onSaveAsTemplate(templateName);
      toast({
        title: "Success",
        description: "Template saved successfully",
      });
      setSaveOpen(false);
      setTemplateName("");
    } catch (error) {
      console.error("Error saving template:", error);
      toast({
        title: "Error",
        description: "Could not save template. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            disabled={disabled}
          >
            Select Template
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <Command>
              <CommandInput placeholder="Search templates..." />
              <CommandList>
                <CommandEmpty>No templates found.</CommandEmpty>
                <CommandGroup>
                  {templates.map((template) => (
                    <CommandItem
                      key={template.id}
                      value={template.id}
                      onSelect={() => {
                        onSelectTemplate(template);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className="mr-2 h-4 w-4 opacity-0"
                      />
                      <div className="flex flex-col">
                        <span>{template.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {template.procedureType}
                        </span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          )}
        </PopoverContent>
      </Popover>

      <Dialog open={saveOpen} onOpenChange={setSaveOpen}>
        <DialogTrigger asChild>
          <Button
            size="icon"
            variant="outline"
            title="Save as Template"
            disabled={disabled}
          >
            <FilePlus2 className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save as Template</DialogTitle>
            <DialogDescription>
              Save the current notes as a template for future procedures
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="template-name">Template Name</Label>
              <Input
                id="template-name"
                placeholder="e.g., Craniotomy for Tumor Resection"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSaveOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveTemplate}
              disabled={isSaving}
            >
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
