"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ProcedureForm } from "./procedure-form";
import { FileItem, ProcedureData } from "@/lib/types";
import { Check, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AppErrorBoundary } from "@/components/app-error-boundary";

// Sample data for different procedure types
const PROCEDURE_SAMPLES: Record<string, Partial<ProcedureData>> = {
  Cranial: {
    patientId: "CR12345",
    patientName: "John Smith",
    patientAge: 54,
    patientGender: "Male",
    diagnosis: "Right frontal glioblastoma",
    procedureType: "Cranial",
    surgeonRole: "Lead",
    location: "Memorial Hospital",
    notes: "Patient underwent right frontal craniotomy for tumor resection. Used neuronavigation for tumor localization. Gross total resection achieved. Intraoperative MRI confirmed complete resection. Hemostasis secured with bipolar cautery.",
    complications: "None",
    outcome: "Patient recovered from anesthesia without new deficits. Post-op MRI showed complete resection.",
    followUp: "Follow-up in clinic in 2 weeks. Referred to neuro-oncology for adjuvant therapy planning.",
    images: [
      { id: "cr1", url: "/demo/craniotomy1.jpg", fileName: "Pre-op MRI", caption: "Pre-operative T1 with contrast", type: "image" },
      { id: "cr2", url: "/demo/craniotomy2.jpg", fileName: "Tumor bed", caption: "After resection", type: "image" }
    ],
    radiologyImages: [
      { id: "crr1", url: "/demo/mri1.jpg", fileName: "Pre-op MRI", caption: "T1 with contrast", type: "radiology" },
      { id: "crr2", url: "/demo/mri2.jpg", fileName: "Post-op MRI", caption: "24 hours post-op", type: "radiology" }
    ]
  },

  Spinal: {
    patientId: "SP45678",
    patientName: "Sarah Johnson",
    patientAge: 62,
    patientGender: "Female",
    diagnosis: "L4-L5 herniated disc with radiculopathy",
    procedureType: "Spinal",
    surgeonRole: "Lead",
    location: "University Medical Center",
    notes: "Patient underwent minimally invasive L4-L5 microdiscectomy. Hemilaminotomy was performed with operating microscope. Herniated disc fragment compressing L5 nerve root was identified and removed. Good decompression achieved.",
    complications: "Small dural tear, repaired with 6-0 prolene suture",
    outcome: "Immediate relief of radicular pain. Motor and sensory functions intact post-operatively.",
    followUp: "Physical therapy to begin in 2 weeks. Follow-up visit in 4 weeks.",
    images: [
      { id: "sp1", url: "/demo/lumbar1.jpg", fileName: "Exposure", caption: "Surgical exposure", type: "image" }
    ],
    radiologyImages: [
      { id: "spr1", url: "/demo/lumbar-mri.jpg", fileName: "Pre-op MRI", caption: "L4-L5 disc herniation", type: "radiology" },
      { id: "spr2", url: "/demo/ct-lumbar.jpg", fileName: "Post-op CT", caption: "Confirming decompression", type: "radiology" }
    ]
  },

  Vascular: {
    patientId: "VA78901",
    patientName: "Michael Brown",
    patientAge: 45,
    patientGender: "Male",
    diagnosis: "Right middle cerebral artery aneurysm",
    procedureType: "Vascular",
    surgeonRole: "Lead",
    location: "Neurovascular Center",
    notes: "Right pterional craniotomy performed. Sylvian fissure opened. MCA aneurysm identified at M1-M2 junction. Temporary clip placed on M1. Permanent clip positioned across aneurysm neck. Temporary clip removed. Intraoperative angiogram confirmed complete occlusion of aneurysm with patency of parent vessel and branches.",
    complications: "Brief period of vasospasm after temporary clipping, resolved with papaverine irrigation",
    outcome: "Patient extubated on postoperative day 1. No new neurological deficits.",
    followUp: "ICU monitoring for 48 hours. Follow-up angiogram in 1 week.",
    images: [
      { id: "va1", url: "/demo/aneurysm1.jpg", fileName: "Pre-clipping", caption: "Aneurysm before clipping", type: "image" },
      { id: "va2", url: "/demo/aneurysm2.jpg", fileName: "Post-clipping", caption: "After clip placement", type: "image" }
    ],
    videos: [
      { id: "vid1", url: "/demo/procedure-video.mp4", fileName: "Clipping", caption: "Aneurysm clipping technique", type: "video" }
    ],
    radiologyImages: [
      { id: "var1", url: "/demo/angiogram1.jpg", fileName: "Pre-op angiogram", caption: "MCA aneurysm", type: "radiology" },
      { id: "var2", url: "/demo/angiogram2.jpg", fileName: "Post-op angiogram", caption: "Complete occlusion", type: "radiology" }
    ]
  },

  Functional: {
    patientId: "FN23456",
    patientName: "Emily Davis",
    patientAge: 72,
    patientGender: "Female",
    diagnosis: "Refractory trigeminal neuralgia",
    procedureType: "Functional",
    surgeonRole: "Lead",
    location: "Neuroscience Institute",
    notes: "Microvascular decompression performed via retrosigmoid approach. Vascular compression of trigeminal nerve root by superior cerebellar artery identified. Teflon pledget placed between artery and nerve.",
    complications: "None",
    outcome: "Complete resolution of trigeminal pain immediately after procedure.",
    followUp: "Discharge on post-op day 2. Follow-up in clinic in 2 weeks.",
    images: [
      { id: "fn1", url: "/demo/trigeminal1.jpg", fileName: "Compression", caption: "Neurovascular conflict", type: "image" }
    ],
    radiologyImages: [
      { id: "fnr1", url: "/demo/mri-trigeminal.jpg", fileName: "FIESTA MRI", caption: "Pre-op imaging showing neurovascular conflict", type: "radiology" }
    ]
  },

  Pediatric: {
    patientId: "PD34567",
    patientName: "Lucas Wilson",
    patientAge: 7,
    patientGender: "Male",
    diagnosis: "Posterior fossa medulloblastoma",
    procedureType: "Pediatric",
    surgeonRole: "Lead",
    location: "Children's Medical Center",
    notes: "Patient underwent suboccipital craniotomy with telovelar approach. Gross total resection of medulloblastoma achieved. Intraoperative neuromonitoring showed stable signals throughout procedure.",
    complications: "Mild cerebellar edema post-op, managed conservatively",
    outcome: "Patient extubated on post-op day 1. Mild truncal ataxia noted but improving.",
    followUp: "MRI in 48 hours to confirm resection. Oncology consultation for adjuvant therapy planning.",
    images: [
      { id: "pd1", url: "/demo/medullo1.jpg", fileName: "Tumor exposure", caption: "Tumor exposure", type: "image" },
      { id: "pd2", url: "/demo/medullo2.jpg", fileName: "After resection", caption: "After tumor removal", type: "image" }
    ],
    videos: [
      { id: "vid2", url: "/demo/procedure-video.mp4", fileName: "Resection", caption: "Key steps of resection", type: "video" }
    ],
    radiologyImages: [
      { id: "pdr1", url: "/demo/medullo-mri1.jpg", fileName: "Pre-op MRI", caption: "Posterior fossa tumor", type: "radiology" },
      { id: "pdr2", url: "/demo/medullo-mri2.jpg", fileName: "Post-op MRI", caption: "Confirming resection", type: "radiology" }
    ]
  }
};

export function TestProcedureForm() {
  const [selectedType, setSelectedType] = useState<string>("Cranial");
  const [isLoading, setIsLoading] = useState(false);
  const [testStatus, setTestStatus] = useState("");
  const { toast } = useToast();

  // Load sample data for the selected procedure type
  const sampleProcedure = {
    ...PROCEDURE_SAMPLES[selectedType],
    id: `test-${Date.now()}`,
    date: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  } as ProcedureData;

  // Handle procedure type selection
  const handleTypeSelect = (type: string) => {
    setSelectedType(type);
    setTestStatus("");
  };

  // Handle form submission
  const handleSubmit = async (data: any, files: { images: FileItem[], videos: FileItem[], radiologyImages: FileItem[] }) => {
    setIsLoading(true);
    setTestStatus("processing");

    try {
      // Simulate API call
      console.log("Submitting test procedure:", data);
      console.log("Images:", files.images.length);
      console.log("Videos:", files.videos.length);
      console.log("Radiology Images:", files.radiologyImages.length);

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulate success
      setTestStatus("success");
      toast({
        title: "Test Successful",
        description: `Successfully processed ${selectedType} procedure with ${files.images.length} images, ${files.videos.length} videos, and ${files.radiologyImages.length} radiology images.`,
      });
    } catch (error) {
      console.error("Test error:", error);
      setTestStatus("error");
      toast({
        title: "Test Failed",
        description: "There was an error processing the test procedure.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppErrorBoundary section="test-procedure">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold mb-4">Test Procedure Form</h1>
          <p className="text-muted-foreground mb-6">
            Test the procedure form with different procedure types and sample data.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
            <h3 className="text-blue-800 font-medium mb-2">Test Instructions</h3>
            <p className="text-blue-700 mb-2">
              This page allows you to test the procedure form with pre-populated data for different neurosurgical procedure types.
            </p>
            <ol className="list-decimal pl-5 text-blue-700 space-y-1">
              <li>Select a procedure type to load sample data</li>
              <li>Review and modify the form fields as needed</li>
              <li>Submit the form to test validation and error handling</li>
              <li>Check the browser console for detailed output</li>
            </ol>
          </div>

          <div className="bg-white border rounded-md p-4">
            <h3 className="font-medium mb-3">Select Procedure Type</h3>
            <div className="flex flex-wrap gap-2">
              {Object.keys(PROCEDURE_SAMPLES).map((type) => (
                <Button
                  key={type}
                  variant={selectedType === type ? "default" : "outline"}
                  onClick={() => handleTypeSelect(type)}
                  className={`transition-all ${selectedType === type ? "bg-blue-600" : ""}`}
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {testStatus === "success" ? (
          <div className="bg-green-50 border border-green-200 rounded-md p-6 text-center">
            <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-green-100 mb-4">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-xl font-medium text-green-800 mb-2">Test Completed Successfully</h3>
            <p className="text-green-700 mb-4">
              The {selectedType} procedure was processed without errors.
            </p>
            <Button onClick={() => setTestStatus("")}>Test Another Procedure</Button>
          </div>
        ) : (
          <div className="glass-card p-6">
            <ProcedureForm
              procedure={sampleProcedure}
              onSubmit={handleSubmit}
              isEdit={false}
            />

            {isLoading && (
              <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
                  <p className="text-lg font-medium">Processing {selectedType} Procedure...</p>
                  <p className="text-sm text-gray-500">This may take a few moments</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </AppErrorBoundary>
  );
}
