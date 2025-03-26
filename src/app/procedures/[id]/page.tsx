"use client";

import { useState, useEffect } from "react";
import React from "react";
import { useRouter, useParams } from "next/navigation";
import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { FileGallery } from "@/components/file-gallery";
import { Edit, FileDown, Printer, Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generatePDF } from "@/services/pdf-generator";
import { FileItem, ProcedureData } from "@/lib/types";
import { AppErrorBoundary } from "@/components/app-error-boundary";
import { ProcedureDetailSkeleton } from "@/app/procedures/components/procedure-skeleton"; // Import the skeleton component

// Mock procedure details
const MOCK_PROCEDURES: ProcedureData[] = [
  {
    id: "1",
    patientId: "P12345",
    patientName: "John Smith",
    patientAge: 54,
    patientGender: "Male",
    date: new Date("2025-03-10"),
    diagnosis: "Glioblastoma multiforme",
    procedureType: "Cranial",
    surgeonRole: "Lead",
    location: "Memorial Hospital",
    notes: "Patient underwent craniotomy for tumor resection. Gross total resection achieved with minimal blood loss. No complications during the procedure. Stealth navigation was used for precise localization.",
    complications: "None",
    outcome: "Patient recovered well from anesthesia. No new neurological deficits.",
    followUp: "Follow-up appointment scheduled in 2 weeks. MRI to be performed at 48 hours post-op.",
    images: [
      {
        id: "img1",
        url: "/demo/craniotomy1.jpg",
        caption: "Pre-operative MRI scan",
        type: "image"
      },
      {
        id: "img2",
        url: "/demo/craniotomy2.jpg",
        caption: "Intraoperative view",
        type: "image"
      }
    ],
    videos: [
      {
        id: "vid1",
        url: "/demo/procedure-video.mp4",
        caption: "Tumor resection technique",
        type: "video",
        videoType: "file"
      },
      {
        id: "ytv1",
        url: "https://www.youtube.com/watch?v=jFGGboW5z_U",
        caption: "Craniotomy Educational Video",
        type: "video",
        videoType: "youtube"
      }
    ],
    radiologyImages: [
      {
        id: "rad1",
        url: "/demo/craniotomy1.jpg",
        caption: "Pre-operative CT scan",
        type: "radiology"
      },
      {
        id: "rad2",
        url: "/demo/craniotomy2.jpg",
        caption: "MRI with contrast",
        type: "radiology"
      }
    ],
    createdAt: new Date("2025-03-10T18:20:00"),
    updatedAt: new Date("2025-03-11T09:15:00")
  },
  {
    id: "2",
    patientId: "P12346",
    patientName: "Sarah Johnson",
    patientAge: 43,
    patientGender: "Female",
    date: new Date("2025-03-08"),
    diagnosis: "Lumbar disc herniation L4-L5",
    procedureType: "Spinal",
    surgeonRole: "Lead",
    location: "University Medical Center",
    notes: "Microdiscectomy performed at L4-L5 level. Patient positioned prone. Hemilaminotomy performed with operating microscope. Herniated disc fragment identified and removed.",
    complications: "None",
    outcome: "Immediate relief of radicular pain. Normal motor and sensory function post-operatively.",
    followUp: "Physical therapy to begin in 2 weeks. Follow-up visit in 4 weeks.",
    images: [
      {
        id: "img3",
        url: "/demo/lumbar1.jpg",
        caption: "Pre-operative MRI",
        type: "image"
      }
    ],
    videos: [
      {
        id: "ytv2",
        url: "https://www.youtube.com/watch?v=XcRIHrZCjtQ",
        caption: "Lumbar Microdiscectomy Procedure Guide",
        type: "video",
        videoType: "youtube"
      }
    ],
    radiologyImages: [
      {
        id: "rad3",
        url: "/demo/lumbar1.jpg",
        caption: "Lumbar spine MRI",
        type: "radiology"
      },
      {
        id: "rad4",
        url: "/demo/lumbar2.jpg",
        caption: "Flexion-extension X-rays",
        type: "radiology"
      },
      {
        id: "rad5",
        url: "/demo/lumbar3.jpg",
        caption: "CT myelogram",
        type: "radiology"
      }
    ],
    createdAt: new Date("2025-03-08T10:30:00"),
    updatedAt: new Date("2025-03-08T15:45:00")
  },
  {
    id: "3",
    patientId: "P12347",
    patientName: "David Williams",
    patientAge: 62,
    patientGender: "Male",
    date: new Date("2025-03-05"),
    diagnosis: "Anterior communicating artery aneurysm",
    procedureType: "Vascular",
    surgeonRole: "Assistant",
    location: "Memorial Hospital",
    notes: "Patient underwent clipping of anterior communicating artery aneurysm. The procedure was performed via pterional craniotomy. Intraoperative angiography confirmed complete obliteration of the aneurysm.",
    complications: "Mild vasospasm intraoperatively, managed with papaverine irrigation.",
    outcome: "Patient remained neurologically intact. Good recovery from anesthesia.",
    followUp: "ICU monitoring for 48 hours. Follow-up angiogram in 1 week.",
    images: [
      {
        id: "img4",
        url: "/demo/aneurysm1.jpg",
        caption: "Aneurysm before clipping",
        type: "image"
      },
      {
        id: "img5",
        url: "/demo/aneurysm2.jpg",
        caption: "After clipping",
        type: "image"
      }
    ],
    videos: [
      {
        id: "vid2",
        url: "/demo/procedure-video.mp4",
        caption: "Clipping technique",
        type: "video",
        videoType: "file"
      },
      {
        id: "ytv3",
        url: "https://www.youtube.com/watch?v=cxN4nKk2cfk",
        caption: "Aneurysm Clipping Procedure",
        type: "video",
        videoType: "youtube"
      }
    ],
    radiologyImages: [
      {
        id: "rad6",
        url: "/demo/angiogram1.jpg",
        caption: "Pre-operative angiogram",
        type: "radiology"
      },
      {
        id: "rad7",
        url: "/demo/angiogram2.jpg",
        caption: "Post-operative angiogram",
        type: "radiology"
      }
    ],
    createdAt: new Date("2025-03-05T09:20:00"),
    updatedAt: new Date("2025-03-05T14:15:00")
  },
  {
    id: "4",
    patientId: "P12348",
    patientName: "Emily Brown",
    patientAge: 34,
    patientGender: "Female",
    date: new Date("2025-03-01"),
    diagnosis: "Trigeminal neuralgia",
    procedureType: "Functional",
    surgeonRole: "Lead",
    location: "Neuroscience Institute",
    notes: "Microvascular decompression performed via retrosigmoid approach. Vascular compression of trigeminal nerve root by superior cerebellar artery identified. Teflon pledget placed between artery and nerve.",
    complications: "None",
    outcome: "Complete resolution of trigeminal pain immediately after procedure.",
    followUp: "Discharge on post-op day 2. Follow-up in clinic in 2 weeks.",
    images: [
      {
        id: "img6",
        url: "/demo/trigeminal1.jpg",
        caption: "Trigeminal nerve compression",
        type: "image"
      }
    ],
    videos: [
      {
        id: "ytv4",
        url: "https://www.youtube.com/watch?v=uOUWWtCx3uk",
        caption: "Microvascular Decompression Educational Video",
        type: "video",
        videoType: "youtube"
      }
    ],
    radiologyImages: [
      {
        id: "rad8",
        url: "/demo/mri-trigeminal.jpg",
        caption: "FIESTA MRI showing neurovascular conflict",
        type: "radiology"
      }
    ],
    createdAt: new Date("2025-03-01T11:30:00"),
    updatedAt: new Date("2025-03-01T16:45:00")
  },
  {
    id: "5",
    patientId: "P12349",
    patientName: "Michael Lee",
    patientAge: 7,
    patientGender: "Male",
    date: new Date("2025-02-28"),
    diagnosis: "Posterior fossa medulloblastoma",
    procedureType: "Pediatric",
    surgeonRole: "Lead",
    location: "Children's Medical Center",
    notes: "Patient underwent suboccipital craniotomy with telovelar approach. Gross total resection of medulloblastoma achieved. Intraoperative neuromonitoring showed stable signals throughout procedure.",
    complications: "Mild cerebellar edema post-op, managed conservatively.",
    outcome: "Patient extubated on post-op day 1. Mild truncal ataxia noted but improving.",
    followUp: "MRI in 48 hours to confirm resection. Oncology consultation for adjuvant therapy planning.",
    images: [
      {
        id: "img7",
        url: "/demo/medullo1.jpg",
        caption: "Tumor exposure",
        type: "image"
      },
      {
        id: "img8",
        url: "/demo/medullo2.jpg",
        caption: "After resection",
        type: "image"
      }
    ],
    videos: [
      {
        id: "vid3",
        url: "/demo/procedure-video.mp4",
        caption: "Key steps of resection",
        type: "video",
        videoType: "file"
      },
      {
        id: "ytv5",
        url: "https://www.youtube.com/watch?v=f0XQlRxuWYM",
        caption: "Pediatric Posterior Fossa Surgery",
        type: "video",
        videoType: "youtube"
      }
    ],
    radiologyImages: [
      {
        id: "rad9",
        url: "/demo/medullo-mri1.jpg",
        caption: "Pre-operative MRI",
        type: "radiology"
      },
      {
        id: "rad10",
        url: "/demo/medullo-mri2.jpg",
        caption: "Post-operative MRI",
        type: "radiology"
      },
      {
        id: "rad11",
        url: "/demo/spine-screening.jpg",
        caption: "Spine screening MRI",
        type: "radiology"
      }
    ],
    createdAt: new Date("2025-02-28T08:20:00"),
    updatedAt: new Date("2025-02-28T13:15:00")
  }
];

export default function ProcedureDetailPage({ params }: { params: { id: string } | Promise<{ id: string }> }) {
  // Unwrap params properly with React.use() if it's a promise
  const unwrappedParams = params instanceof Promise ? React.use(params) : params;
  const paramsFromHook = useParams();
  const procedureId = unwrappedParams.id || (paramsFromHook?.id as string);

  const [procedure, setProcedure] = useState<ProcedureData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    // Simulate API call to fetch procedure details
    const fetchProcedure = async () => {
      setIsLoading(true);
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // Find the procedure with the matching ID
        const foundProcedure = MOCK_PROCEDURES.find(p => p.id === procedureId);

        if (foundProcedure) {
          setProcedure(foundProcedure);
        } else {
          toast({
            title: "Procedure not found",
            description: "The requested procedure could not be found.",
            variant: "destructive",
          });
          router.push("/procedures");
        }
      } catch (error: unknown) {
        console.error("Error fetching procedure:", error);
        toast({
          title: "Error",
          description: "Failed to load procedure details.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (procedureId) {
      fetchProcedure();
    } else {
      // Handle the case where procedureId might be undefined
      toast({
        title: "Error",
        description: "Invalid procedure ID.",
        variant: "destructive",
      });
      router.push("/procedures");
    }
  }, [procedureId, router, toast]);

  const handleEdit = () => {
    router.push(`/procedures/${procedureId}/edit`);
  };

  const handleDelete = async () => {
    try {
      // In a real app, this would be a DELETE request to your API
      await new Promise(resolve => setTimeout(resolve, 500));

      toast({
        title: "Procedure deleted",
        description: "The procedure has been successfully deleted.",
      });

      router.push("/procedures");
    } catch (error: unknown) {
      console.error("Error deleting procedure:", error);
      toast({
        title: "Error",
        description: "Failed to delete the procedure.",
        variant: "destructive",
      });
    }
  };

  const handleExport = async () => {
    try {
      if (!procedure) return;

      setIsPdfLoading(true);

      // Generate and download the PDF
      await generatePDF(procedure);

      toast({
        title: "Export successful",
        description: "The procedure has been exported as a PDF.",
      });
    } catch (error: unknown) {
      console.error("Error exporting procedure:", error);
      toast({
        title: "Export failed",
        description: "Failed to export the procedure. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsPdfLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return <ProcedureDetailSkeleton />; // Use the skeleton component during loading
  }

  if (!procedure) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold">Procedure not found</h2>
        <p className="text-muted-foreground mt-2">The requested procedure could not be found.</p>
        <Button className="mt-4" onClick={() => router.push("/procedures")}>
          Back to Procedures
        </Button>
      </div>
    );
  }

  return (
    <AppErrorBoundary section="procedure-details">
      <div className="space-y-8 print:space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
          <div>
            <h1 className="text-3xl font-bold">{procedure.procedureType} Procedure</h1>
            <p className="text-muted-foreground">
              {format(new Date(procedure.date), "MMMM d, yyyy")} • {procedure.location}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={handleEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              disabled={isPdfLoading}
            >
              <FileDown className="h-4 w-4 mr-2" />
              {isPdfLoading ? "Generating..." : "Export PDF"}
            </Button>
            <Button variant="destructive" size="sm" onClick={handleDelete}>
              <Trash className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2 print:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Patient Information
                <Badge variant="outline">{procedure.procedureType}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium">Patient Name</h3>
                  <p>{procedure.patientName}</p>
                </div>
                <div>
                  <h3 className="font-medium">Patient ID</h3>
                  <p>{procedure.patientId}</p>
                </div>
                <div>
                  <h3 className="font-medium">Age</h3>
                  <p>{procedure.patientAge} years</p>
                </div>
                <div>
                  <h3 className="font-medium">Gender</h3>
                  <p>{procedure.patientGender}</p>
                </div>
                <div>
                  <h3 className="font-medium">Diagnosis</h3>
                  <p>{procedure.diagnosis}</p>
                </div>
                <div>
                  <h3 className="font-medium">Surgeon Role</h3>
                  <p>{procedure.surgeonRole} Surgeon</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="print:hidden">
            <CardHeader>
              <CardTitle>Procedure Details</CardTitle>
              <CardDescription>Created on {format(new Date(procedure.createdAt), "MMM d, yyyy")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <h3 className="font-medium">Date</h3>
                  <p>{format(new Date(procedure.date), "MMMM d, yyyy")}</p>
                </div>
                <div>
                  <h3 className="font-medium">Location</h3>
                  <p>{procedure.location}</p>
                </div>
                <div>
                  <h3 className="font-medium">Last Updated</h3>
                  <p>{format(new Date(procedure.updatedAt), "MMM d, yyyy 'at' h:mm a")}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full print:hidden">
          <TabsList className="grid w-full grid-cols-3 print:hidden">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
            <TabsTrigger value="followup">Follow-up</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="pt-4 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Procedure Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="whitespace-pre-wrap">
                  {procedure.notes || "No procedure notes provided."}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Complications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="whitespace-pre-wrap">
                  {procedure.complications || "No complications noted."}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Outcome</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="whitespace-pre-wrap">
                  {procedure.outcome || "No outcome information provided."}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="media" className="pt-4 space-y-6">
            {(procedure.images?.length > 0 || procedure.videos?.length > 0 || procedure.radiologyImages?.length > 0) ? (
              <>
                {procedure.images?.length > 0 && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-bold">Operative Images</h2>
                    <FileGallery files={procedure.images} editable={false} />
                  </div>
                )}

                {procedure.videos?.length > 0 && (
                  <div className="space-y-4 mt-8">
                    <h2 className="text-xl font-bold">Operative Videos</h2>
                    <FileGallery files={procedure.videos} editable={false} />
                  </div>
                )}

                {procedure.radiologyImages?.length > 0 && (
                  <div className="space-y-4 mt-8">
                    <h2 className="text-xl font-bold">Radiology Images</h2>
                    <FileGallery files={procedure.radiologyImages} editable={false} />
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-10">
                <p className="text-muted-foreground">No media files available for this procedure.</p>
                <Button
                  className="mt-4"
                  variant="outline"
                  onClick={handleEdit}
                >
                  Edit procedure to add media
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="followup" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Follow-up Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="whitespace-pre-wrap">
                  {procedure.followUp || "No follow-up plan specified."}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Print View */}
        <div className="hidden print:block space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <h2 className="text-xl font-bold">Procedure Notes</h2>
              <div className="mt-2 whitespace-pre-wrap">
                {procedure.notes || "No procedure notes provided."}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold">Complications</h2>
              <div className="mt-2 whitespace-pre-wrap">
                {procedure.complications || "No complications noted."}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold">Outcome</h2>
              <div className="mt-2 whitespace-pre-wrap">
                {procedure.outcome || "No outcome information provided."}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold">Follow-up Plan</h2>
              <div className="mt-2 whitespace-pre-wrap">
                {procedure.followUp || "No follow-up plan specified."}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppErrorBoundary>
  );
}
