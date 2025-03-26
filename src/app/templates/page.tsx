"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { CalendarX, Edit, FilePlus2, Loader2, Trash2 } from "lucide-react";
import { Template } from "@/lib/types";

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<Template | null>(null);
  const [newTemplate, setNewTemplate] = useState({
    name: "",
    procedureType: "",
    notes: "",
    complications: "",
    outcome: "",
    followUp: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    // Define fetchTemplates inside useEffect to avoid dependency warnings
    async function fetchTemplates() {
      try {
        setIsLoading(true);
        const response = await fetch("/api/templates");

        if (!response.ok) {
          throw new Error("Failed to fetch templates");
        }

        const data = await response.json();
        setTemplates(data.templates.map((template: Template) => ({
          ...template,
          createdAt: new Date(template.createdAt),
          updatedAt: new Date(template.updatedAt),
        })));
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
  }, [toast]);

  const handleCreateTemplate = async () => {
    if (!newTemplate.name || !newTemplate.procedureType || !newTemplate.notes) {
      toast({
        title: "Error",
        description: "Name, procedure type, and notes are required.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch("/api/templates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTemplate),
      });

      if (!response.ok) {
        throw new Error("Failed to create template");
      }

      toast({
        title: "Success",
        description: "Template created successfully.",
      });
      setCreateDialogOpen(false);
      setNewTemplate({
        name: "",
        procedureType: "",
        notes: "",
        complications: "",
        outcome: "",
        followUp: "",
      });
      fetchTemplates();
    } catch (error) {
      console.error("Error creating template:", error);
      toast({
        title: "Error",
        description: "Could not create template. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditTemplate = async () => {
    if (!currentTemplate) return;

    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/templates/${currentTemplate.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: currentTemplate.name,
          procedureType: currentTemplate.procedureType,
          notes: currentTemplate.notes,
          complications: currentTemplate.complications || "",
          outcome: currentTemplate.outcome || "",
          followUp: currentTemplate.followUp || "",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update template");
      }

      toast({
        title: "Success",
        description: "Template updated successfully.",
      });
      setEditDialogOpen(false);
      fetchTemplates();
    } catch (error) {
      console.error("Error updating template:", error);
      toast({
        title: "Error",
        description: "Could not update template. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTemplate = async () => {
    if (!currentTemplate) return;

    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/templates/${currentTemplate.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete template");
      }

      toast({
        title: "Success",
        description: "Template deleted successfully.",
      });
      setDeleteDialogOpen(false);
      fetchTemplates();
    } catch (error) {
      console.error("Error deleting template:", error);
      toast({
        title: "Error",
        description: "Could not delete template. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Operative Note Templates</h1>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center">
              <FilePlus2 className="mr-2 h-4 w-4" />
              Create Template
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create Template</DialogTitle>
              <DialogDescription>
                Create a new operative note template for future procedures.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  placeholder="Template name"
                  className="col-span-3"
                  value={newTemplate.name}
                  onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">
                  Procedure Type
                </Label>
                <Select
                  value={newTemplate.procedureType}
                  onValueChange={(value) => setNewTemplate({ ...newTemplate, procedureType: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cranial">Cranial</SelectItem>
                    <SelectItem value="Spinal">Spinal</SelectItem>
                    <SelectItem value="Functional">Functional</SelectItem>
                    <SelectItem value="Vascular">Vascular</SelectItem>
                    <SelectItem value="Pediatric">Pediatric</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <Label htmlFor="notes" className="text-right pt-2">
                  Notes
                </Label>
                <Textarea
                  id="notes"
                  placeholder="Procedure notes"
                  className="col-span-3 min-h-[150px]"
                  value={newTemplate.notes}
                  onChange={(e) => setNewTemplate({ ...newTemplate, notes: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 gap-4">
                <Label htmlFor="complications" className="text-right pt-2">
                  Complications
                </Label>
                <Textarea
                  id="complications"
                  placeholder="Complications (optional)"
                  className="col-span-3"
                  value={newTemplate.complications}
                  onChange={(e) => setNewTemplate({ ...newTemplate, complications: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 gap-4">
                <Label htmlFor="outcome" className="text-right pt-2">
                  Outcome
                </Label>
                <Textarea
                  id="outcome"
                  placeholder="Outcome (optional)"
                  className="col-span-3"
                  value={newTemplate.outcome}
                  onChange={(e) => setNewTemplate({ ...newTemplate, outcome: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 gap-4">
                <Label htmlFor="followup" className="text-right pt-2">
                  Follow-up
                </Label>
                <Textarea
                  id="followup"
                  placeholder="Follow-up plan (optional)"
                  className="col-span-3"
                  value={newTemplate.followUp}
                  onChange={(e) => setNewTemplate({ ...newTemplate, followUp: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateTemplate} disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Template
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : templates.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <CalendarX className="h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Templates Available</h2>
          <p className="text-muted-foreground max-w-md">
            You haven't created any operative note templates yet. Create a template to quickly fill in procedure notes.
          </p>
          <Button
            className="mt-4"
            onClick={() => setCreateDialogOpen(true)}
          >
            Create Your First Template
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <Card key={template.id} className="glass-card">
              <CardHeader>
                <CardTitle>{template.name}</CardTitle>
                <CardDescription>
                  {template.procedureType} • Last updated: {template.updatedAt.toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="max-h-48 overflow-y-auto mb-4">
                  <p className="text-sm whitespace-pre-wrap">{template.notes}</p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setCurrentTemplate(template);
                    setDeleteDialogOpen(true);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setCurrentTemplate(template);
                    setEditDialogOpen(true);
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Template</DialogTitle>
            <DialogDescription>
              Update your operative note template.
            </DialogDescription>
          </DialogHeader>
          {currentTemplate && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="edit-name"
                  placeholder="Template name"
                  className="col-span-3"
                  value={currentTemplate.name}
                  onChange={(e) => setCurrentTemplate({ ...currentTemplate, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-type" className="text-right">
                  Procedure Type
                </Label>
                <Select
                  value={currentTemplate.procedureType}
                  onValueChange={(value) => setCurrentTemplate({ ...currentTemplate, procedureType: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cranial">Cranial</SelectItem>
                    <SelectItem value="Spinal">Spinal</SelectItem>
                    <SelectItem value="Functional">Functional</SelectItem>
                    <SelectItem value="Vascular">Vascular</SelectItem>
                    <SelectItem value="Pediatric">Pediatric</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <Label htmlFor="edit-notes" className="text-right pt-2">
                  Notes
                </Label>
                <Textarea
                  id="edit-notes"
                  placeholder="Procedure notes"
                  className="col-span-3 min-h-[150px]"
                  value={currentTemplate.notes}
                  onChange={(e) => setCurrentTemplate({ ...currentTemplate, notes: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 gap-4">
                <Label htmlFor="edit-complications" className="text-right pt-2">
                  Complications
                </Label>
                <Textarea
                  id="edit-complications"
                  placeholder="Complications (optional)"
                  className="col-span-3"
                  value={currentTemplate.complications || ""}
                  onChange={(e) => setCurrentTemplate({ ...currentTemplate, complications: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 gap-4">
                <Label htmlFor="edit-outcome" className="text-right pt-2">
                  Outcome
                </Label>
                <Textarea
                  id="edit-outcome"
                  placeholder="Outcome (optional)"
                  className="col-span-3"
                  value={currentTemplate.outcome || ""}
                  onChange={(e) => setCurrentTemplate({ ...currentTemplate, outcome: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 gap-4">
                <Label htmlFor="edit-followup" className="text-right pt-2">
                  Follow-up
                </Label>
                <Textarea
                  id="edit-followup"
                  placeholder="Follow-up plan (optional)"
                  className="col-span-3"
                  value={currentTemplate.followUp || ""}
                  onChange={(e) => setCurrentTemplate({ ...currentTemplate, followUp: e.target.value })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditTemplate} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this template? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteTemplate}
              disabled={isSubmitting}
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
