"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileGallery } from "@/components/file-gallery";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileItem, ProcedureData } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Search,
  Image as ImageIcon,
  FileVideo,
  FileImage,
  FileText,
  Globe,
  Filter
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define types for the search results
interface NoteResult {
  id: string;
  patientName: string;
  procedureType: string;
  date: string;
  notes: string;
  procedureId: string;
}

interface SearchResultsType {
  images: FileItem[];
  videos: FileItem[];
  radiologyImages: FileItem[];
  notes: NoteResult[];
}

const initialSearchResults: SearchResultsType = {
  images: [],
  videos: [],
  radiologyImages: [],
  notes: [],
};

// Demo mock data
const mockPublicImages: FileItem[] = [
  {
    id: "img1",
    url: "https://images.unsplash.com/photo-1603899122634-f086ca5f5ddd?q=80&w=2574&auto=format&fit=crop",
    caption: "Brain MRI Coronal View",
    type: "image",
    isPublic: true,
  },
  {
    id: "img2",
    url: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?q=80&w=2528&auto=format&fit=crop",
    caption: "Angiogram of Cerebral Vessels",
    type: "image",
    isPublic: true,
  },
];

const mockPublicVideos: FileItem[] = [
  {
    id: "vid1",
    url: "https://www.youtube.com/watch?v=8Z9Eu7F4et0",
    caption: "Neuroendoscopic Approach",
    type: "video",
    videoType: "youtube",
    isPublic: true,
  },
];

const mockPublicRadiology: FileItem[] = [
  {
    id: "rad1",
    url: "/mock-dicom.dcm",
    caption: "DICOM Brain Scan",
    type: "radiology",
    fileType: "dicom",
    isPublic: true,
  },
];

const mockPublicNotes: NoteResult[] = [
  {
    id: "note1",
    patientName: "Anonymous Patient",
    procedureType: "Craniotomy",
    date: "2023-11-14",
    notes: "The craniotomy was performed using a standard approach. The procedure was uncomplicated and the patient recovered well post-operatively.",
    procedureId: "proc123",
  },
  {
    id: "note2",
    patientName: "Anonymous Patient",
    procedureType: "Spinal Fusion",
    date: "2023-10-22",
    notes: "L4-L5 fusion was performed with placement of pedicle screws. Intraoperative navigation was used for accurate placement.",
    procedureId: "proc456",
  },
];

export default function GlobalSearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [searchResults, setSearchResults] = useState<SearchResultsType>(initialSearchResults);
  const [contentType, setContentType] = useState<string>("all");

  // Simulating search functionality
  useEffect(() => {
    if (searchTerm.trim() === "") {
      // Show some featured/recent content when no search term is provided
      setSearchResults({
        images: mockPublicImages,
        videos: mockPublicVideos,
        radiologyImages: mockPublicRadiology,
        notes: mockPublicNotes,
      });
      return;
    }

    // Simulate search with filtering
    const term = searchTerm.toLowerCase();

    const filteredImages = mockPublicImages.filter(
      img => img.caption?.toLowerCase().includes(term)
    );

    const filteredVideos = mockPublicVideos.filter(
      vid => vid.caption?.toLowerCase().includes(term)
    );

    const filteredRadiology = mockPublicRadiology.filter(
      rad => rad.caption?.toLowerCase().includes(term)
    );

    const filteredNotes = mockPublicNotes.filter(
      note => note.notes.toLowerCase().includes(term) ||
              note.procedureType.toLowerCase().includes(term)
    );

    setSearchResults({
      images: filteredImages,
      videos: filteredVideos,
      radiologyImages: filteredRadiology,
      notes: filteredNotes,
    });
  }, [searchTerm]);

  // Filter results by content type
  const getFilteredResults = (): SearchResultsType => {
    switch (contentType) {
      case "images":
        return { ...initialSearchResults, images: searchResults.images };
      case "videos":
        return { ...initialSearchResults, videos: searchResults.videos };
      case "radiology":
        return { ...initialSearchResults, radiologyImages: searchResults.radiologyImages };
      case "notes":
        return { ...initialSearchResults, notes: searchResults.notes };
      default:
        return searchResults;
    }
  };

  const filteredResults = getFilteredResults();

  // Calculate total results
  const totalResults =
    filteredResults.images.length +
    filteredResults.videos.length +
    filteredResults.radiologyImages.length +
    filteredResults.notes.length;

  return (
    <div className="container max-w-6xl py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text inline-block">
          Global Search
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Search for publicly shared medical images, videos, radiology files, and procedure notes
        </p>

        <div className="flex gap-2 items-center mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Input
              placeholder="Search for medical content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 rounded-xl"
            />
          </div>

          <div className="w-48">
            <Select value={contentType} onValueChange={setContentType}>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="All content types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All content types</SelectItem>
                <SelectItem value="images">Images</SelectItem>
                <SelectItem value="videos">Videos</SelectItem>
                <SelectItem value="radiology">Radiology</SelectItem>
                <SelectItem value="notes">Procedure Notes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {searchTerm && (
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Found {totalResults} result{totalResults !== 1 ? 's' : ''} for "{searchTerm}"
          </div>
        )}
      </div>

      <div className="space-y-8">
        {/* Images Section */}
        {filteredResults.images.length > 0 && (
          <div>
            <div className="flex items-center mb-4">
              <ImageIcon className="h-5 w-5 text-blue-600 mr-2" />
              <h2 className="text-xl font-semibold">Images</h2>
            </div>
            <FileGallery
              files={filteredResults.images}
              editable={false}
              showPublicControls={false}
            />
          </div>
        )}

        {/* Videos Section */}
        {filteredResults.videos.length > 0 && (
          <div>
            <div className="flex items-center mb-4">
              <FileVideo className="h-5 w-5 text-blue-600 mr-2" />
              <h2 className="text-xl font-semibold">Videos</h2>
            </div>
            <FileGallery
              files={filteredResults.videos}
              editable={false}
              showPublicControls={false}
            />
          </div>
        )}

        {/* Radiology Section */}
        {filteredResults.radiologyImages.length > 0 && (
          <div>
            <div className="flex items-center mb-4">
              <FileImage className="h-5 w-5 text-blue-600 mr-2" />
              <h2 className="text-xl font-semibold">Radiology Images</h2>
            </div>
            <FileGallery
              files={filteredResults.radiologyImages}
              editable={false}
              showPublicControls={false}
            />
          </div>
        )}

        {/* Notes Section */}
        {filteredResults.notes.length > 0 && (
          <div>
            <div className="flex items-center mb-4">
              <FileText className="h-5 w-5 text-blue-600 mr-2" />
              <h2 className="text-xl font-semibold">Procedure Notes</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredResults.notes.map(note => (
                <Card key={note.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-base">{note.procedureType}</CardTitle>
                        <CardDescription>
                          Date: {new Date(note.date).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <Globe className="h-4 w-4 text-green-600" />
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm line-clamp-4">{note.notes}</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <a href={`/procedures/${note.procedureId}`}>
                        View Full Procedure
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* No results */}
        {totalResults === 0 && searchTerm && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-medium mb-2">No results found</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              We couldn't find any public content matching your search.
              Try using different keywords or checking the content type filter.
            </p>
          </div>
        )}

        {/* If no search term, show guidance */}
        {!searchTerm && totalResults === 0 && (
          <div className="text-center py-12">
            <Globe className="h-12 w-12 mx-auto text-blue-500 mb-4" />
            <h3 className="text-xl font-medium mb-2">Discover public medical content</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              Enter search terms above to find publicly shared medical images, videos,
              radiology files, and anonymized procedure notes from other users.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
