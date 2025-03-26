"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ProcedureListSkeleton } from "./components/procedure-skeleton";
import { AdvancedSearch } from "./components/advanced-search";
import { FileSpreadsheet, Plus, Film, Image as ImageIcon } from "lucide-react"; // Added Film and ImageIcon

// Define the procedure interface
interface Procedure {
  id: string;
  date: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  diagnosis: string;
  procedureType: string;
  surgeonRole: string;
  location: string;
  images: number;
  radiologyImages: number;
  videos: number; // Added videos count
}

// Procedure types for type-safety
const procedureTypes = ["All", "Cranial", "Spinal", "Functional", "Vascular", "Pediatric"];

// Sort options
const sortOptions = [
  { value: "date-desc", label: "Date (Newest First)" },
  { value: "date-asc", label: "Date (Oldest First)" },
  { value: "name-asc", label: "Patient Name (A-Z)" },
  { value: "name-desc", label: "Patient Name (Z-A)" },
];

// Advanced search filter interface
interface SearchFilters {
  query: string;
  procedureTypes: string[];
  surgeonRoles: string[];
  locations: string[];
  dateFrom: Date | null;
  dateTo: Date | null;
}

// Mock data with properly formatted dates
const mockProcedures: Procedure[] = [
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
    videos: 1, // Added video count
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
    videos: 2, // Added video count
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
    videos: 0, // Added video count
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
    videos: 1, // Added video count
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
    videos: 2, // Added video count
  },
];

// Helper function for date formatting
function formatDate(dateString: string): string {
  try {
    return new Date(dateString).toLocaleDateString();
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString;
  }
}

// Helper function to check if a date is within range
function isDateInRange(dateStr: string, fromDate: Date | null, toDate: Date | null): boolean {
  if (!fromDate && !toDate) return true;

  const date = new Date(dateStr);

  if (fromDate && toDate) {
    return date >= fromDate && date <= toDate;
  } else if (fromDate) {
    return date >= fromDate;
  } else if (toDate) {
    return date <= toDate;
  }

  return true;
}

// Procedures page with built-in auth check
export default function ProceduresPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const [filteredProcedures, setFilteredProcedures] = useState<Procedure[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [sortBy, setSortBy] = useState("date-desc");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<SearchFilters>({
    query: "",
    procedureTypes: [],
    surgeonRoles: [],
    locations: [],
    dateFrom: null,
    dateTo: null,
  });

  // Count active filters
  const countActiveFilters = () => {
    let count = 0;
    if (activeFilters.query) count++;
    if (activeFilters.procedureTypes.length > 0) count++;
    if (activeFilters.surgeonRoles.length > 0) count++;
    if (activeFilters.locations.length > 0) count++;
    if (activeFilters.dateFrom) count++;
    if (activeFilters.dateTo) count++;
    return count;
  };

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/procedures");
    }
  }, [status, router]);

  // Fetch procedures
  useEffect(() => {
    if (status === "authenticated") {
      // In a real app, fetch from API
      // async function fetchProcedures() {
      //   const response = await fetch('/api/procedures');
      //   const data = await response.json();
      //   setProcedures(data);
      //   setFilteredProcedures(data);
      //   setIsLoading(false);
      // }
      // fetchProcedures();

      // For demo purposes
      setTimeout(() => {
        setProcedures(mockProcedures);
        setFilteredProcedures(mockProcedures);
        setIsLoading(false);
      }, 500);
    }
  }, [status]);

  // Apply advanced search filters
  const handleAdvancedSearch = (filters: SearchFilters) => {
    setActiveFilters(filters);

    // Also update the simple filter if procedure types are selected
    if (filters.procedureTypes.length === 1) {
      setSelectedFilter(filters.procedureTypes[0]);
    } else if (filters.procedureTypes.length === 0) {
      setSelectedFilter("All");
    }

    // Update search query
    setSearchQuery(filters.query);
  };

  // Filter and sort procedures when filter, sort, or search changes
  useEffect(() => {
    if (procedures.length === 0) return;

    let result = [...procedures];

    // Apply type filter from the top buttons
    if (selectedFilter !== "All") {
      result = result.filter(p => p.procedureType === selectedFilter);
    }

    // Apply advanced filters
    if (activeFilters.procedureTypes.length > 0) {
      result = result.filter(p => activeFilters.procedureTypes.includes(p.procedureType));
    }

    if (activeFilters.surgeonRoles.length > 0) {
      result = result.filter(p => activeFilters.surgeonRoles.includes(p.surgeonRole));
    }

    if (activeFilters.locations.length > 0) {
      result = result.filter(p => activeFilters.locations.includes(p.location));
    }

    // Apply date range filter
    result = result.filter(p => isDateInRange(p.date, activeFilters.dateFrom, activeFilters.dateTo));

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.patientName.toLowerCase().includes(query) ||
        p.diagnosis.toLowerCase().includes(query) ||
        p.patientId.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case "date-asc":
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "name-asc":
          return a.patientName.localeCompare(b.patientName);
        case "name-desc":
          return b.patientName.localeCompare(a.patientName);
        default:
          return 0;
      }
    });

    setFilteredProcedures(result);
  }, [procedures, selectedFilter, sortBy, searchQuery, activeFilters]);

  // Reset all filters
  const resetAllFilters = () => {
    setSelectedFilter("All");
    setSearchQuery("");
    setActiveFilters({
      query: "",
      procedureTypes: [],
      surgeonRoles: [],
      locations: [],
      dateFrom: null,
      dateTo: null,
    });
  };

  // Show loading state while checking session
  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If unauthenticated and not redirected yet, show message
  if (!session) {
    return (
      <div className="text-center p-8">
        <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
        <p className="mb-4">You need to be logged in to view your procedures.</p>
        <Link href="/login?callbackUrl=/procedures">
          <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded">
            Go to Login
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Modern header with gradient background */}
      <div className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 p-6 shadow-lg dark:from-blue-800 dark:to-indigo-900">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Procedures</h1>
            <p className="text-blue-100 mt-1">
              Manage and view your neurosurgical procedures.
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/procedures/import">
              <Button variant="secondary" className="gap-2 bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm">
                <FileSpreadsheet className="h-4 w-4" />
                Import from Excel
              </Button>
            </Link>
            <Link href="/procedures/new">
              <Button className="bg-white text-blue-600 hover:bg-blue-50 gap-2">
                <Plus className="h-4 w-4" />
                Add Procedure
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Search and Filter Controls with more modern design */}
      <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {procedureTypes.map((type) => (
              <button
                key={type}
                className={`border rounded-full px-4 py-1.5 text-sm transition-colors ${
                  selectedFilter === type
                    ? "bg-blue-600 text-white border-blue-600 shadow-md dark:bg-blue-700 dark:border-blue-700"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                }`}
                onClick={() => setSelectedFilter(type)}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="flex flex-col md:flex-row w-full md:w-auto gap-2">
            <input
              type="text"
              placeholder="Search procedures..."
              className="px-4 py-2 border rounded-full text-sm w-full md:w-64 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <select
              className="px-4 py-2 border rounded-full text-sm bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {/* Advanced Search Component */}
            <AdvancedSearch
              onSearch={handleAdvancedSearch}
              initialFilters={activeFilters}
              activeFilterCount={countActiveFilters()}
            />
          </div>
        </div>

        {/* Active Filters Display with improved visual style */}
        {countActiveFilters() > 0 && (
          <div className="flex flex-wrap items-center gap-2 bg-gray-50 dark:bg-gray-700 p-4 rounded-xl mt-4 border dark:border-gray-600">
            <span className="text-sm font-medium dark:text-gray-200">Active Filters:</span>

            {activeFilters.query && (
              <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 text-xs font-medium px-3 py-1 rounded-full flex items-center">
                Search: {activeFilters.query}
                <button
                  className="ml-2 text-blue-800 dark:text-blue-100 hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full h-4 w-4 flex items-center justify-center"
                  onClick={() => setActiveFilters({...activeFilters, query: ""})}
                >
                  ×
                </button>
              </span>
            )}

            {activeFilters.procedureTypes.map(type => (
              <span key={type} className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 text-xs font-medium px-3 py-1 rounded-full flex items-center">
                Type: {type}
                <button
                  className="ml-2 text-blue-800 dark:text-blue-100 hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full h-4 w-4 flex items-center justify-center"
                  onClick={() => setActiveFilters({
                    ...activeFilters,
                    procedureTypes: activeFilters.procedureTypes.filter(t => t !== type)
                  })}
                >
                  ×
                </button>
              </span>
            ))}

            {activeFilters.surgeonRoles.map(role => (
              <span key={role} className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 text-xs font-medium px-3 py-1 rounded-full flex items-center">
                Role: {role}
                <button
                  className="ml-2 text-blue-800 dark:text-blue-100 hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full h-4 w-4 flex items-center justify-center"
                  onClick={() => setActiveFilters({
                    ...activeFilters,
                    surgeonRoles: activeFilters.surgeonRoles.filter(r => r !== role)
                  })}
                >
                  ×
                </button>
              </span>
            ))}

            {activeFilters.locations.map(location => (
              <span key={location} className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 text-xs font-medium px-3 py-1 rounded-full flex items-center">
                Location: {location}
                <button
                  className="ml-2 text-blue-800 dark:text-blue-100 hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full h-4 w-4 flex items-center justify-center"
                  onClick={() => setActiveFilters({
                    ...activeFilters,
                    locations: activeFilters.locations.filter(l => l !== location)
                  })}
                >
                  ×
                </button>
              </span>
            ))}

            {activeFilters.dateFrom && (
              <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 text-xs font-medium px-3 py-1 rounded-full flex items-center">
                From: {activeFilters.dateFrom.toLocaleDateString()}
                <button
                  className="ml-2 text-blue-800 dark:text-blue-100 hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full h-4 w-4 flex items-center justify-center"
                  onClick={() => setActiveFilters({...activeFilters, dateFrom: null})}
                >
                  ×
                </button>
              </span>
            )}

            {activeFilters.dateTo && (
              <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 text-xs font-medium px-3 py-1 rounded-full flex items-center">
                To: {activeFilters.dateTo.toLocaleDateString()}
                <button
                  className="ml-2 text-blue-800 dark:text-blue-100 hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full h-4 w-4 flex items-center justify-center"
                  onClick={() => setActiveFilters({...activeFilters, dateTo: null})}
                >
                  ×
                </button>
              </span>
            )}

            <button
              className="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 ml-auto"
              onClick={resetAllFilters}
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* Procedures table with improved styling for dark mode */}
      <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
        {isLoading ? (
          <ProcedureListSkeleton />
        ) : filteredProcedures.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-lg font-medium mb-2 dark:text-white">No procedures found</p>
            <p className="text-muted-foreground mb-4 dark:text-gray-400">
              {procedures.length === 0
                ? "You haven't recorded any procedures yet."
                : "No procedures match your current filters."}
            </p>
            {procedures.length === 0 && (
              <Link href="/procedures/new">
                <Button>Add Your First Procedure</Button>
              </Link>
            )}
            {procedures.length > 0 && (
              <Button onClick={resetAllFilters}>Clear All Filters</Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-gray-700 dark:text-gray-200">Date</th>
                  <th scope="col" className="px-6 py-3 text-gray-700 dark:text-gray-200">Patient</th>
                  <th scope="col" className="px-6 py-3 hidden md:table-cell text-gray-700 dark:text-gray-200">Diagnosis</th>
                  <th scope="col" className="px-6 py-3 text-gray-700 dark:text-gray-200">Type</th>
                  <th scope="col" className="px-6 py-3 hidden md:table-cell text-gray-700 dark:text-gray-200">Role</th>
                  <th scope="col" className="px-6 py-3 hidden md:table-cell text-gray-700 dark:text-gray-200">Location</th>
                  <th scope="col" className="px-6 py-3 text-gray-700 dark:text-gray-200">Media</th>
                  <th scope="col" className="px-6 py-3 text-gray-700 dark:text-gray-200">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProcedures.map((procedure) => (
                  <tr key={procedure.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      {formatDate(procedure.date)}
                    </td>
                    <td className="px-6 py-4 text-gray-900 dark:text-white">
                      <div>{procedure.patientName}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{procedure.patientId}</div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell max-w-[200px] truncate text-gray-900 dark:text-white">
                      {procedure.diagnosis}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`
                        inline-block rounded-full px-3 py-1 text-xs
                        ${procedure.procedureType === "Cranial" ? "bg-blue-50 text-blue-700 border border-blue-300 dark:bg-blue-900 dark:text-blue-100 dark:border-blue-800" : ""}
                        ${procedure.procedureType === "Spinal" ? "bg-green-50 text-green-700 border border-green-300 dark:bg-green-900 dark:text-green-100 dark:border-green-800" : ""}
                        ${procedure.procedureType === "Vascular" ? "bg-red-50 text-red-700 border border-red-300 dark:bg-red-900 dark:text-red-100 dark:border-red-800" : ""}
                        ${procedure.procedureType === "Functional" ? "bg-purple-50 text-purple-700 border border-purple-300 dark:bg-purple-900 dark:text-purple-100 dark:border-purple-800" : ""}
                        ${procedure.procedureType === "Pediatric" ? "bg-yellow-50 text-yellow-700 border border-yellow-300 dark:bg-yellow-900 dark:text-yellow-100 dark:border-yellow-800" : ""}
                      `}>
                        {procedure.procedureType}
                      </span>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell text-gray-900 dark:text-white">
                      {procedure.surgeonRole}
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell text-gray-900 dark:text-white">
                      {procedure.location}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs flex items-center gap-1 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100 rounded-full px-2.5 py-1">
                          <ImageIcon className="h-3 w-3" />
                          {procedure.images}
                        </span>
                        <span className="text-xs flex items-center gap-1 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-full px-2.5 py-1">
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="12"></line>
                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                          </svg>
                          {procedure.radiologyImages}
                        </span>
                        <span className="text-xs flex items-center gap-1 bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-100 rounded-full px-2.5 py-1">
                          <Film className="h-3 w-3" />
                          {procedure.videos}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link href={`/procedures/${procedure.id}`} className="font-medium text-blue-600 dark:text-blue-400 hover:underline">
                          View
                        </Link>
                        <Link href={`/procedures/${procedure.id}/edit`} className="font-medium text-blue-600 dark:text-blue-400 hover:underline">
                          Edit
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
