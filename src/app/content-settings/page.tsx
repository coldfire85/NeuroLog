"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { FileItem, ProcedureData } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Globe, Shield, FileVideo, Image as ImageIcon, FileImage, FileText, Info } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define our settings type
interface SharingSettings {
  defaultImageSharing: boolean;
  defaultVideoSharing: boolean;
  defaultRadiologySharing: boolean;
  defaultNotesSharing: boolean;
  anonymizeProcedureNotes: boolean;
  anonymizePatientDetails: boolean;
}

// Mock data
const mockProcedures: Partial<ProcedureData>[] = [
  {
    id: "proc1",
    patientName: "John Smith",
    date: new Date("2023-11-10"),
    procedureType: "Craniotomy",
    images: [
      {
        id: "img1",
        url: "https://images.unsplash.com/photo-1603899122634-f086ca5f5ddd?q=80&w=2574&auto=format&fit=crop",
        type: "image",
        caption: "Post-operative imaging",
        isPublic: false
      }
    ],
    videos: [
      {
        id: "vid1",
        url: "https://youtube.com/watch?v=example1",
        type: "video",
        videoType: "youtube",
        caption: "Surgical technique",
        isPublic: true
      }
    ],
    notesPublic: false
  },
  {
    id: "proc2",
    patientName: "Jane Doe",
    date: new Date("2023-10-15"),
    procedureType: "Spinal Fusion",
    radiologyImages: [
      {
        id: "rad1",
        url: "/mock-dicom.dcm",
        type: "radiology",
        fileType: "dicom",
        caption: "Pre-operative scan",
        isPublic: false
      }
    ],
    notesPublic: false
  }
];

// Default settings
const defaultSettings: SharingSettings = {
  defaultImageSharing: false,
  defaultVideoSharing: false,
  defaultRadiologySharing: false,
  defaultNotesSharing: false,
  anonymizeProcedureNotes: true,
  anonymizePatientDetails: true
};

export default function ContentSettingsPage() {
  const [settings, setSettings] = useState<SharingSettings>(defaultSettings);
  const [procedures, setProcedures] = useState<Partial<ProcedureData>[]>(mockProcedures);
  const [activeTab, setActiveTab] = useState("defaults");
  const [searchTerm, setSearchTerm] = useState("");
  const [procedureType, setProcedureType] = useState<string>("all");
  const { toast } = useToast();

  // Update a specific setting
  const updateSetting = (key: keyof SharingSettings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));

    toast({
      title: "Settings updated",
      description: `${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} has been ${value ? 'enabled' : 'disabled'}.`,
    });
  };

  // Update procedure media visibility
  const toggleProcedureMediaVisibility = (
    procedureId: string,
    mediaType: "images" | "videos" | "radiologyImages",
    mediaId: string,
    isPublic: boolean
  ) => {
    setProcedures(prev =>
      prev.map(proc => {
        if (proc.id === procedureId) {
          const mediaArray = proc[mediaType] || [];
          // Type assertion for TypeScript to understand the structure
          const updatedMediaArray = (mediaArray as FileItem[]).map((item: FileItem) =>
            item.id === mediaId ? { ...item, isPublic } : item
          );

          return {
            ...proc,
            [mediaType]: updatedMediaArray
          };
        }
        return proc;
      })
    );

    toast({
      title: isPublic ? "Item made public" : "Item made private",
      description: isPublic
        ? "This item is now visible to other users in global search"
        : "This item is now private and only visible to you",
    });
  };

  // Toggle procedure notes public/private
  const toggleNotesVisibility = (procedureId: string, isPublic: boolean) => {
    setProcedures(prev =>
      prev.map(proc =>
        proc.id === procedureId
          ? { ...proc, notesPublic: isPublic }
          : proc
      )
    );

    toast({
      title: isPublic ? "Notes made public" : "Notes made private",
      description: isPublic
        ? "These notes are now visible to other users in global search"
        : "These notes are now private and only visible to you",
    });
  };

  // Filter procedures based on search term and type
  const filteredProcedures = procedures.filter(proc => {
    const matchesSearch = searchTerm === "" ||
      proc.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proc.procedureType?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = procedureType === "all" || proc.procedureType === procedureType;

    return matchesSearch && matchesType;
  });

  // Get unique procedure types for filter
  const procedureTypes = Array.from(
    new Set(procedures.map(proc => proc.procedureType).filter(Boolean) as string[])
  );

  return (
    <div className="container max-w-5xl py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text inline-block">
          Content Sharing Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Manage your content sharing preferences and what others can see in the global search
        </p>

        <Alert className="mb-4">
          <Info className="h-4 w-4" />
          <AlertTitle>Content Visibility</AlertTitle>
          <AlertDescription>
            When you make content public, it will be visible to other users in global search.
            Patient information is always anonymized for public content.
          </AlertDescription>
        </Alert>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="defaults">Default Settings</TabsTrigger>
            <TabsTrigger value="manage">Manage Public Content</TabsTrigger>
          </TabsList>

          <TabsContent value="defaults">
            <Card>
              <CardHeader>
                <CardTitle>Default Sharing Preferences</CardTitle>
                <CardDescription>
                  Set the default visibility for new content you add to procedures
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center">
                        <ImageIcon className="h-4 w-4 mr-2 text-blue-600" />
                        <Label htmlFor="default-image-sharing" className="font-medium">
                          Images
                        </Label>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Make new images public by default
                      </p>
                    </div>
                    <Switch
                      id="default-image-sharing"
                      checked={settings.defaultImageSharing}
                      onCheckedChange={(checked) => updateSetting("defaultImageSharing", checked)}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center">
                        <FileVideo className="h-4 w-4 mr-2 text-blue-600" />
                        <Label htmlFor="default-video-sharing" className="font-medium">
                          Videos
                        </Label>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Make new videos public by default
                      </p>
                    </div>
                    <Switch
                      id="default-video-sharing"
                      checked={settings.defaultVideoSharing}
                      onCheckedChange={(checked) => updateSetting("defaultVideoSharing", checked)}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center">
                        <FileImage className="h-4 w-4 mr-2 text-blue-600" />
                        <Label htmlFor="default-radiology-sharing" className="font-medium">
                          Radiology Files
                        </Label>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Make new radiology files public by default
                      </p>
                    </div>
                    <Switch
                      id="default-radiology-sharing"
                      checked={settings.defaultRadiologySharing}
                      onCheckedChange={(checked) => updateSetting("defaultRadiologySharing", checked)}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-blue-600" />
                        <Label htmlFor="default-notes-sharing" className="font-medium">
                          Procedure Notes
                        </Label>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Make new procedure notes public by default
                      </p>
                    </div>
                    <Switch
                      id="default-notes-sharing"
                      checked={settings.defaultNotesSharing}
                      onCheckedChange={(checked) => updateSetting("defaultNotesSharing", checked)}
                    />
                  </div>
                </div>
              </CardContent>
              <CardHeader>
                <CardTitle>Privacy Safeguards</CardTitle>
                <CardDescription>
                  Protect patient information when sharing content
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center">
                        <Shield className="h-4 w-4 mr-2 text-green-600" />
                        <Label htmlFor="anonymize-notes" className="font-medium">
                          Anonymize Procedure Notes
                        </Label>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Remove patient identifiers from shared notes
                      </p>
                    </div>
                    <Switch
                      id="anonymize-notes"
                      checked={settings.anonymizeProcedureNotes}
                      onCheckedChange={(checked) => updateSetting("anonymizeProcedureNotes", checked)}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center">
                        <Shield className="h-4 w-4 mr-2 text-green-600" />
                        <Label htmlFor="anonymize-patient" className="font-medium">
                          Anonymize Patient Details
                        </Label>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Replace patient names with "Anonymous Patient" in public content
                      </p>
                    </div>
                    <Switch
                      id="anonymize-patient"
                      checked={settings.anonymizePatientDetails}
                      onCheckedChange={(checked) => updateSetting("anonymizePatientDetails", checked)}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-6">
                <Button onClick={() => {
                  setSettings(defaultSettings);
                  toast({
                    title: "Settings reset",
                    description: "Your sharing preferences have been reset to default values.",
                  });
                }}>
                  Reset to Defaults
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="manage">
            <div className="flex gap-3 mb-6">
              <div className="relative flex-1">
                <Input
                  placeholder="Search procedures..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-3 rounded-xl"
                />
              </div>

              <div className="w-48">
                <Select value={procedureType} onValueChange={setProcedureType}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="All procedure types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All procedure types</SelectItem>
                    {procedureTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {filteredProcedures.length === 0 ? (
              <div className="text-center py-12">
                <Shield className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-medium mb-2">No procedures found</h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                  {searchTerm || procedureType !== "all"
                    ? "No procedures match your search criteria. Try adjusting your filters."
                    : "You haven't added any procedures yet."}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredProcedures.map(proc => (
                  <Card key={proc.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{proc.procedureType}</CardTitle>
                          <CardDescription>
                            Patient: {proc.patientName} | Date: {proc.date && new Date(proc.date).toLocaleDateString()}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0 pb-2">
                      <div className="space-y-6">
                        {/* Notes sharing section */}
                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 mr-2 text-blue-600" />
                            <span className="text-sm font-medium">Procedure Notes</span>
                          </div>
                          <Switch
                            checked={!!proc.notesPublic}
                            onCheckedChange={(checked) => proc.id && toggleNotesVisibility(proc.id, checked)}
                          />
                        </div>

                        {/* Images section */}
                        {proc.images && proc.images.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium flex items-center">
                              <ImageIcon className="h-4 w-4 mr-2 text-blue-600" />
                              Images
                            </h4>
                            <div className="space-y-2">
                              {proc.images.map((img) => (
                                <div key={img.id} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-2 rounded-md">
                                  <span className="text-sm truncate max-w-[80%]">
                                    {img.caption || "Unlabeled image"}
                                  </span>
                                  <Switch
                                    checked={!!img.isPublic}
                                    onCheckedChange={(checked) =>
                                      proc.id && img.id && toggleProcedureMediaVisibility(proc.id, "images", img.id, checked)
                                    }
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Videos section */}
                        {proc.videos && proc.videos.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium flex items-center">
                              <FileVideo className="h-4 w-4 mr-2 text-blue-600" />
                              Videos
                            </h4>
                            <div className="space-y-2">
                              {proc.videos.map((vid) => (
                                <div key={vid.id} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-2 rounded-md">
                                  <span className="text-sm truncate max-w-[80%]">
                                    {vid.caption || "Unlabeled video"}
                                    {vid.videoType === "youtube" &&
                                      <span className="text-xs ml-1 text-red-500">(YouTube)</span>
                                    }
                                  </span>
                                  <Switch
                                    checked={!!vid.isPublic}
                                    onCheckedChange={(checked) =>
                                      proc.id && vid.id && toggleProcedureMediaVisibility(proc.id, "videos", vid.id, checked)
                                    }
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Radiology section */}
                        {proc.radiologyImages && proc.radiologyImages.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium flex items-center">
                              <FileImage className="h-4 w-4 mr-2 text-blue-600" />
                              Radiology Images
                            </h4>
                            <div className="space-y-2">
                              {proc.radiologyImages.map((rad) => (
                                <div key={rad.id} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-2 rounded-md">
                                  <span className="text-sm truncate max-w-[80%]">
                                    {rad.caption || "Unlabeled radiology image"}
                                    {rad.fileType === "dicom" &&
                                      <span className="text-xs ml-1 text-blue-500">(DICOM)</span>
                                    }
                                  </span>
                                  <Switch
                                    checked={!!rad.isPublic}
                                    onCheckedChange={(checked) =>
                                      proc.id && rad.id && toggleProcedureMediaVisibility(proc.id, "radiologyImages", rad.id, checked)
                                    }
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
