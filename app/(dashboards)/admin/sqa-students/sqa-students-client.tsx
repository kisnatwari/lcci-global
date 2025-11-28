"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, AlertCircle, Loader2, GraduationCap, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { apiClient, ENDPOINTS } from "@/lib/api";

interface SQAStudent {
  name: string;
  scn: string;
}

interface SQAStudentsPageClientProps {
  initialStudents: SQAStudent[];
  error: string | null;
}

export function SQAStudentsPageClient({ initialStudents, error: initialError }: SQAStudentsPageClientProps) {
  const [students, setStudents] = useState<SQAStudent[]>(initialStudents);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(initialError);

  // Fetch SQA students from API (for refresh)
  const fetchStudents = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get(ENDPOINTS.sqaStudents.get());
      if (response.success && response.data && Array.isArray(response.data)) {
        setStudents(response.data);
      } else if (Array.isArray(response)) {
        setStudents(response);
      } else if (response.data && Array.isArray(response.data)) {
        setStudents(response.data);
      } else {
        setStudents([]);
      }
    } catch (err: any) {
      console.error("Failed to fetch SQA students:", err);
      setError(err.message || "Failed to load SQA students");
      setStudents([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter students based on search
  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.scn.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Main Card with all content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <CardTitle className="text-2xl">SQA Students</CardTitle>
              <CardDescription className="mt-1">
                View and manage SQA student registrations
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Error State */}
          {error && (
            <div className="rounded-lg border-2 border-red-200 bg-red-50 p-4 flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-red-900">Error Loading SQA Students</p>
                <p className="text-xs text-red-700 mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Search Section */}
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by name or SCN..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="text-sm text-muted-foreground">
              {filteredStudents.length} {filteredStudents.length === 1 ? "student" : "students"} found
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Loading SQA students...</span>
            </div>
          )}

          {/* Table Section */}
          {!isLoading && filteredStudents.length > 0 ? (
            <div className="rounded-md border overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">#</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>SCN Number</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student, index) => (
                      <TableRow key={`${student.scn}-${index}`}>
                        <TableCell className="text-muted-foreground">
                          {index + 1}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-[color:var(--brand-blue)] to-[color:var(--brand-cyan)] text-white text-sm font-semibold">
                              <User className="w-4 h-4" />
                            </div>
                            <span className="font-medium">{student.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <GraduationCap className="w-4 h-4 text-muted-foreground" />
                            <span className="font-mono text-sm">{student.scn}</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          ) : !isLoading ? (
            <div className="text-center py-12 border rounded-md">
              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-slate-100">
                  <GraduationCap className="w-8 h-8 text-slate-400" />
                </div>
                <div>
                  <p className="text-muted-foreground font-medium">
                    {searchTerm ? "No SQA students found matching your search." : "No SQA students registered yet."}
                  </p>
                  {searchTerm && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Try adjusting your search terms.
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}

