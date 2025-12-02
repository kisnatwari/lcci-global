"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Search, AlertCircle, Loader2, GraduationCap, User, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { apiClient, ENDPOINTS } from "@/lib/api";

interface SQAStudent {
  name: string;
  scn: string;
}

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface SQAStudentsPageClientProps {
  initialStudents: SQAStudent[];
  initialPagination: PaginationData | null;
  initialSearch: string;
  error: string | null;
}

export function SQAStudentsPageClient({ 
  initialStudents, 
  initialPagination,
  initialSearch,
  error: initialError 
}: SQAStudentsPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [students, setStudents] = useState<SQAStudent[]>(initialStudents);
  const [pagination, setPagination] = useState<PaginationData | null>(initialPagination);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(initialError);

  // Get current page, limit, and search from URL
  const currentPage = searchParams.get('page') ? parseInt(searchParams.get('page')!, 10) : 1;
  const currentLimit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!, 10) : 10;
  const currentSearch = searchParams.get('search') || '';

  // Fetch SQA students from API
  const fetchStudents = async (page: number = currentPage, limit: number = currentLimit, search: string = currentSearch) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get(ENDPOINTS.sqaStudents.get(page, limit, search));
      
      // Handle API response structure: { success, data: { data: [...], total, page, limit, totalPages } }
      if (response.success && response.data) {
        // Check if data.data exists (nested structure)
        if (response.data.data && Array.isArray(response.data.data)) {
          setStudents(response.data.data);
          // Extract pagination info from response.data
          if (response.data.total !== undefined) {
            setPagination({
              total: response.data.total,
              page: response.data.page || page,
              limit: response.data.limit || limit,
              totalPages: response.data.totalPages || Math.ceil(response.data.total / (response.data.limit || limit)),
            });
          }
        } else if (Array.isArray(response.data)) {
          // Fallback: if response.data is directly an array
          setStudents(response.data);
        }
      } else if (Array.isArray(response)) {
        // Fallback: if response is directly an array
        setStudents(response);
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

  // Handle page change
  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    if (currentSearch) params.set('search', currentSearch);
    router.push(`/admin/sqa-students?${params.toString()}`);
    fetchStudents(newPage, currentLimit, currentSearch);
  };

  // Handle search with debounce
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    
    // Reset to page 1 when searching
    const params = new URLSearchParams();
    params.set('page', '1');
    if (value.trim()) {
      params.set('search', value.trim());
    }
    router.push(`/admin/sqa-students?${params.toString()}`);
    fetchStudents(1, currentLimit, value.trim());
  };

  // Use students directly (no client-side filtering)
  const displayedStudents = students;

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
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="text-sm text-muted-foreground">
              {pagination 
                ? `Showing ${(pagination.page - 1) * pagination.limit + 1}-${Math.min(pagination.page * pagination.limit, pagination.total)} of ${pagination.total} students`
                : `${displayedStudents.length} ${displayedStudents.length === 1 ? "student" : "students"} found`}
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
          {!isLoading && displayedStudents.length > 0 ? (
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
                    {displayedStudents.map((student, index) => (
                      <TableRow key={`${student.scn}-${index}`}>
                        <TableCell className="text-muted-foreground">
                          {pagination 
                            ? (pagination.page - 1) * pagination.limit + index + 1
                            : index + 1}
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

          {/* Pagination Controls */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between border-t pt-4">
              <div className="text-sm text-muted-foreground">
                Page {pagination.page} of {pagination.totalPages}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(1)}
                  disabled={pagination.page <= 1 || isLoading}
                  className="gap-1"
                  title="First page"
                >
                  <ChevronsLeft className="h-4 w-4" />
                  First
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page <= 1 || isLoading}
                  className="gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    let pageNum: number;
                    if (pagination.totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (pagination.page <= 3) {
                      pageNum = i + 1;
                    } else if (pagination.page >= pagination.totalPages - 2) {
                      pageNum = pagination.totalPages - 4 + i;
                    } else {
                      pageNum = pagination.page - 2 + i;
                    }
                    return (
                      <Button
                        key={pageNum}
                        variant={pagination.page === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(pageNum)}
                        disabled={isLoading}
                        className="min-w-[2.5rem]"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages || isLoading}
                  className="gap-1"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.totalPages)}
                  disabled={pagination.page >= pagination.totalPages || isLoading}
                  className="gap-1"
                  title="Last page"
                >
                  Last
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

