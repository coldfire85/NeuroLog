"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { useState } from "react";

// Mock data for procedures list
const mockProcedures = [
  {
    id: "1",
    date: "2025-03-10",
    patientId: "P12345",
    patientName: "John Smith",
    patientAge: 54,
    patientGender: "Male",
    diagnosis: "Glioblastoma multiforme",
    procedureType: "Cranial",
    surgeonRole: "Lead",
    location: "Memorial Hospital",
    images: 3,
    radiologyImages: 2,
  },
  {
    id: "2",
    date: "2025-03-08",
    patientId: "P12346",
    patientName: "Sarah Johnson",
    patientAge: 43,
    patientGender: "Female",
    diagnosis: "Lumbar disc herniation L4-L5",
    procedureType: "Spinal",
    surgeonRole: "Lead",
    location: "University Medical Center",
    images: 5,
    radiologyImages: 3,
  },
  {
    id: "3",
    date: "2025-03-05",
    patientId: "P12347",
    patientName: "David Williams",
    patientAge: 62,
    patientGender: "Male",
    diagnosis: "Anterior communicating artery aneurysm",
    procedureType: "Vascular",
    surgeonRole: "Assistant",
    location: "Memorial Hospital",
    images: 6,
    radiologyImages: 4,
  },
  {
    id: "4",
    date: "2025-03-01",
    patientId: "P12348",
    patientName: "Emily Brown",
    patientAge: 34,
    patientGender: "Female",
    diagnosis: "Trigeminal neuralgia",
    procedureType: "Functional",
    surgeonRole: "Lead",
    location: "Neuroscience Institute",
    images: 2,
    radiologyImages: 1,
  },
  {
    id: "5",
    date: "2025-02-28",
    patientId: "P12349",
    patientName: "Michael Lee",
    patientAge: 7,
    patientGender: "Male",
    diagnosis: "Posterior fossa medulloblastoma",
    procedureType: "Pediatric",
    surgeonRole: "Lead",
    location: "Children's Medical Center",
    images: 4,
    radiologyImages: 3,
  },
];

// Helper function to format dates safely
function formatDate(dateString) {
  try {
    return new Date(dateString).toLocaleDateString();
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString;
  }
}

export function ProceduresList() {
  const [procedures] = useState(mockProcedures);

  return (
    <div>
      <div className="rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Patient</TableHead>
              <TableHead className="hidden md:table-cell">Diagnosis</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="hidden md:table-cell">Role</TableHead>
              <TableHead className="hidden md:table-cell">Location</TableHead>
              <TableHead>Images</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {procedures.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="h-24 text-center"
                >
                  No procedures recorded yet.
                </TableCell>
              </TableRow>
            ) : (
              procedures.map((procedure) => (
                <TableRow key={procedure.id}>
                  <TableCell className="font-medium">
                    {formatDate(procedure.date)}
                  </TableCell>
                  <TableCell>
                    <div>{procedure.patientName}</div>
                    <div className="text-xs text-muted-foreground">
                      {procedure.patientId}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell max-w-[200px] truncate">
                    {procedure.diagnosis}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`
                        ${procedure.procedureType === "Cranial" ? "bg-blue-50 text-blue-700 border-blue-300" : ""}
                        ${procedure.procedureType === "Spinal" ? "bg-green-50 text-green-700 border-green-300" : ""}
                        ${procedure.procedureType === "Vascular" ? "bg-red-50 text-red-700 border-red-300" : ""}
                        ${procedure.procedureType === "Functional" ? "bg-purple-50 text-purple-700 border-purple-300" : ""}
                        ${procedure.procedureType === "Pediatric" ? "bg-yellow-50 text-yellow-700 border-yellow-300" : ""}
                      `}
                    >
                      {procedure.procedureType}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {procedure.surgeonRole}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {procedure.location}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <span className="text-xs bg-blue-100 text-blue-700 rounded-full px-2 py-0.5">
                        {procedure.images} op
                      </span>
                      <span className="text-xs bg-gray-100 text-gray-700 rounded-full px-2 py-0.5">
                        {procedure.radiologyImages} rad
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Link href={`/procedures/${procedure.id}`}>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </Link>
                      <Link href={`/procedures/${procedure.id}/edit`}>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
