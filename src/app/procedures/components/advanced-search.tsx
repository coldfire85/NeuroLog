"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, ChevronDown, Filter, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// Procedure types
const procedureTypes = ["Cranial", "Spinal", "Functional", "Vascular", "Pediatric"];

// Surgeon roles
const surgeonRoles = ["Lead", "Assistant", "Observer"];

// Location options
const locations = [
  "Memorial Hospital",
  "University Medical Center",
  "Neuroscience Institute",
  "Children's Medical Center",
  "General Hospital",
];

interface SearchFilters {
  query: string;
  procedureTypes: string[];
  surgeonRoles: string[];
  locations: string[];
  dateFrom: Date | null;
  dateTo: Date | null;
}

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => void;
  initialFilters?: Partial<SearchFilters>;
  activeFilterCount?: number;
}

export function AdvancedSearch({
  onSearch,
  initialFilters = {},
  activeFilterCount = 0,
}: AdvancedSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    query: initialFilters.query || "",
    procedureTypes: initialFilters.procedureTypes || [],
    surgeonRoles: initialFilters.surgeonRoles || [],
    locations: initialFilters.locations || [],
    dateFrom: initialFilters.dateFrom || null,
    dateTo: initialFilters.dateTo || null,
  });

  // Count active filters
  const countActiveFilters = () => {
    let count = 0;
    if (filters.query) count++;
    if (filters.procedureTypes.length > 0) count++;
    if (filters.surgeonRoles.length > 0) count++;
    if (filters.locations.length > 0) count++;
    if (filters.dateFrom) count++;
    if (filters.dateTo) count++;
    return count;
  };

  const handleSubmit = () => {
    onSearch(filters);
    setIsOpen(false);
  };

  const handleReset = () => {
    const resetFilters: SearchFilters = {
      query: "",
      procedureTypes: [],
      surgeonRoles: [],
      locations: [],
      dateFrom: null,
      dateTo: null,
    };
    setFilters(resetFilters);
    onSearch(resetFilters);
  };

  const toggleItem = (array: string[], item: string) => {
    return array.includes(item)
      ? array.filter((i) => i !== item)
      : [...array, item];
  };

  // Toggle procedure type
  const toggleProcedureType = (type: string) => {
    setFilters({
      ...filters,
      procedureTypes: toggleItem(filters.procedureTypes, type),
    });
  };

  // Toggle surgeon role
  const toggleSurgeonRole = (role: string) => {
    setFilters({
      ...filters,
      surgeonRoles: toggleItem(filters.surgeonRoles, role),
    });
  };

  // Toggle location
  const toggleLocation = (location: string) => {
    setFilters({
      ...filters,
      locations: toggleItem(filters.locations, location),
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 rounded-full px-4 border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700 dark:text-white"
        >
          <Filter className="h-4 w-4" />
          <span>Advanced Filter</span>
          {activeFilterCount > 0 && (
            <span className="flex items-center justify-center h-5 w-5 rounded-full bg-blue-600 text-white text-xs">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] rounded-xl border dark:border-gray-700 dark:bg-gray-800">
        <DialogHeader>
          <DialogTitle className="text-gray-900 dark:text-white">Advanced Search</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="searchQuery" className="text-gray-700 dark:text-gray-300">Search Text</Label>
            <Input
              id="searchQuery"
              placeholder="Patient name, diagnosis, ID..."
              value={filters.query}
              onChange={(e) => setFilters({ ...filters, query: e.target.value })}
              className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div className="grid gap-2">
            <Label className="text-gray-700 dark:text-gray-300">Procedure Type</Label>
            <div className="flex flex-wrap gap-2">
              {procedureTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => toggleProcedureType(type)}
                  className={cn(
                    "border rounded-full px-3 py-1.5 text-sm transition-colors flex items-center gap-1.5",
                    filters.procedureTypes.includes(type)
                      ? "bg-blue-600 text-white border-blue-600 shadow-sm dark:bg-blue-700 dark:border-blue-700"
                      : "hover:bg-gray-100 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700"
                  )}
                >
                  {filters.procedureTypes.includes(type) && (
                    <Check className="h-3.5 w-3.5" />
                  )}
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-2">
            <Label className="text-gray-700 dark:text-gray-300">Surgeon Role</Label>
            <div className="flex flex-wrap gap-2">
              {surgeonRoles.map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => toggleSurgeonRole(role)}
                  className={cn(
                    "border rounded-full px-3 py-1.5 text-sm transition-colors flex items-center gap-1.5",
                    filters.surgeonRoles.includes(role)
                      ? "bg-blue-600 text-white border-blue-600 shadow-sm dark:bg-blue-700 dark:border-blue-700"
                      : "hover:bg-gray-100 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700"
                  )}
                >
                  {filters.surgeonRoles.includes(role) && (
                    <Check className="h-3.5 w-3.5" />
                  )}
                  {role}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label className="text-gray-700 dark:text-gray-300">From Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal rounded-lg dark:border-gray-600 dark:bg-gray-700",
                      !filters.dateFrom && "text-muted-foreground dark:text-gray-400"
                    )}
                  >
                    {filters.dateFrom ? (
                      format(filters.dateFrom, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 rounded-lg border dark:border-gray-700" align="start">
                  <Calendar
                    mode="single"
                    selected={filters.dateFrom || undefined}
                    onSelect={(date) => setFilters({ ...filters, dateFrom: date })}
                    initialFocus
                    className="dark:bg-gray-800 dark:text-white"
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid gap-2">
              <Label className="text-gray-700 dark:text-gray-300">To Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal rounded-lg dark:border-gray-600 dark:bg-gray-700",
                      !filters.dateTo && "text-muted-foreground dark:text-gray-400"
                    )}
                  >
                    {filters.dateTo ? (
                      format(filters.dateTo, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 rounded-lg border dark:border-gray-700" align="end">
                  <Calendar
                    mode="single"
                    selected={filters.dateTo || undefined}
                    onSelect={(date) => setFilters({ ...filters, dateTo: date })}
                    initialFocus
                    className="dark:bg-gray-800 dark:text-white"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="grid gap-2">
            <Label className="text-gray-700 dark:text-gray-300">Location</Label>
            <div className="max-h-[120px] overflow-y-auto border rounded-lg p-3 dark:border-gray-600 dark:bg-gray-700">
              {locations.map((location) => (
                <div key={location} className="flex items-center space-x-2 py-1.5">
                  <button
                    type="button"
                    onClick={() => toggleLocation(location)}
                    className={cn(
                      "h-5 w-5 rounded-md border flex items-center justify-center transition-colors",
                      filters.locations.includes(location)
                        ? "bg-blue-600 border-blue-600 dark:bg-blue-700 dark:border-blue-700"
                        : "border-gray-300 dark:border-gray-500"
                    )}
                  >
                    {filters.locations.includes(location) && (
                      <Check className="h-3.5 w-3.5 text-white" />
                    )}
                  </button>
                  <label className="text-sm dark:text-gray-200">{location}</label>
                </div>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleReset}
            className="flex items-center gap-1.5 rounded-full border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700 dark:text-white"
          >
            <X className="h-4 w-4" />
            Reset Filters
          </Button>
          <Button onClick={handleSubmit} className="rounded-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800">
            Apply Filters
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
