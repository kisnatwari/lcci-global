"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, MoreVertical, Search, FileText, Pencil, Eye, Copy, Trash2, Loader2, AlertCircle, CheckCircle2, Video, FileImage, Link, ArrowUp, ArrowDown } from "lucide-react";
import { apiClient, ENDPOINTS } from "@/lib/api";

type CourseMaterial = {
  materialId: string;
  courseId: string;
  type: "video" | "pdf" | "doc" | "link";
  title: string;
  url: string;
  orderIndex: number;
  createdAt: string;
  course?: {
    courseId: string;
    name: string;
  };
};

// Static data for development
const initialMaterials: CourseMaterial[] = [
  {
    materialId: "mat-1",
    courseId: "course-1",
    type: "video",
    title: "Introduction to JavaScript Basics",
    url: "https://example.com/video1.mp4",
    orderIndex: 1,
    createdAt: "2025-11-19T10:00:00.000Z",
    course: { courseId: "course-1", name: "Introduction to JavaScript" },
  },
  {
    materialId: "mat-2",
    courseId: "course-1",
    type: "pdf",
    title: "JavaScript Reference Guide",
    url: "https://example.com/js-guide.pdf",
    orderIndex: 2,
    createdAt: "2025-11-19T10:30:00.000Z",
    course: { courseId: "course-1", name: "Introduction to JavaScript" },
  },
  {
    materialId: "mat-3",
    courseId: "course-2",
    type: "link",
    title: "Business Management Resources",
    url: "https://example.com/business-resources",
    orderIndex: 1,
    createdAt: "2025-11-18T15:00:00.000Z",
    course: { courseId: "course-2", name: "Advanced Business Management" },
  },
];

const initialCourses = [
  { courseId: "course-1", name: "Introduction to JavaScript" },
  { courseId: "course-2", name: "Advanced Business Management" },
  { courseId: "course-3", name: "Professional English Communication" },
];

export default function MaterialsPage() {
  const [materials, setMaterials] = useState<CourseMaterial[]>(initialMaterials);
  const [courses, setCourses] = useState<any[]>(initialCourses);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<CourseMaterial | null>(null);
  const [deletingMaterial, setDeletingMaterial] = useState<CourseMaterial | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    url: "",
    type: "video" as "video" | "pdf" | "doc" | "link",
    courseId: "",
    orderIndex: "",
  });

  // Loading and error states
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch data on mount
  useEffect(() => {
    // For now, just set loading to false since we're using static data
    setIsLoading(false);
    // fetchMaterials();
    // fetchCourses();
  }, []);

  // Filter materials based on search
  const filteredMaterials = materials.filter(
    (material) =>
      material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (material.course && material.course.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Handle create/edit dialog open
  const handleOpenDialog = (material?: CourseMaterial) => {
    setError(null);
    setSuccessMessage(null);
    if (material) {
      setEditingMaterial(material);
      setFormData({
        title: material.title || "",
        url: material.url || "",
        type: material.type,
        courseId: material.courseId,
        orderIndex: material.orderIndex.toString(),
      });
    } else {
      setEditingMaterial(null);
      setFormData({
        title: "",
        url: "",
        type: "video",
        courseId: "",
        orderIndex: "",
      });
    }
    setIsDialogOpen(true);
  };

  // Handle save (create or update)
  const handleSave = async () => {
    if (!formData.title || !formData.title.trim()) {
      setError("Material title is required");
      return;
    }

    if (!formData.url || !formData.url.trim()) {
      setError("Material URL is required");
      return;
    }

    if (!formData.courseId) {
      setError("Course is required");
      return;
    }

    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const payload = {
        title: formData.title.trim(),
        url: formData.url.trim(),
        type: formData.type,
        courseId: formData.courseId,
        orderIndex: parseInt(formData.orderIndex) || materials.length + 1,
      };

      if (editingMaterial) {
        // Update existing material (static for now)
        setMaterials(materials.map(mat => 
          mat.materialId === editingMaterial.materialId 
            ? { ...mat, ...payload, course: courses.find(c => c.courseId === payload.courseId) }
            : mat
        ));
        setSuccessMessage("Material updated successfully!");
      } else {
        // Create new material (static for now)
        const newMaterial: CourseMaterial = {
          materialId: `mat-${Date.now()}`,
          ...payload,
          createdAt: new Date().toISOString(),
          course: courses.find(c => c.courseId === payload.courseId),
        };
        setMaterials([...materials, newMaterial]);
        setSuccessMessage("Material created successfully!");
      }

      // Close dialog after a short delay to show success message
      setTimeout(() => {
        setIsDialogOpen(false);
        setEditingMaterial(null);
        setFormData({
          title: "",
          url: "",
          type: "video",
          courseId: "",
          orderIndex: "",
        });
        setSuccessMessage(null);
      }, 1000);
    } catch (err: any) {
      console.error("Failed to save material:", err);
      setError(err.message || (editingMaterial ? "Failed to update material" : "Failed to create material"));
    } finally {
      setIsSaving(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!deletingMaterial) return;

    setIsSaving(true);
    setError(null);

    try {
      // Delete material (static for now)
      setMaterials(materials.filter((material) => material.materialId !== deletingMaterial.materialId));
      
      // Close dialog
      setIsDeleteDialogOpen(false);
      setDeletingMaterial(null);
      
      console.log("Material deleted successfully");
    } catch (err: any) {
      console.error("Failed to delete material:", err);
      setError(err.message || "Failed to delete material");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle reorder
  const handleReorder = (materialId: string, direction: "up" | "down") => {
    const material = materials.find(m => m.materialId === materialId);
    if (!material) return;

    const sameCourse = materials.filter(m => m.courseId === material.courseId);
    const currentIndex = sameCourse.findIndex(m => m.materialId === materialId);
    
    if (direction === "up" && currentIndex > 0) {
      const targetMaterial = sameCourse[currentIndex - 1];
      setMaterials(materials.map(m => {
        if (m.materialId === materialId) return { ...m, orderIndex: targetMaterial.orderIndex };
        if (m.materialId === targetMaterial.materialId) return { ...m, orderIndex: material.orderIndex };
        return m;
      }));
    } else if (direction === "down" && currentIndex < sameCourse.length - 1) {
      const targetMaterial = sameCourse[currentIndex + 1];
      setMaterials(materials.map(m => {
        if (m.materialId === materialId) return { ...m, orderIndex: targetMaterial.orderIndex };
        if (m.materialId === targetMaterial.materialId) return { ...m, orderIndex: material.orderIndex };
        return m;
      }));
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get material type icon
  const getMaterialIcon = (type: string) => {
    switch (type) {
      case "video": return <Video className="h-4 w-4" />;
      case "pdf": return <FileText className="h-4 w-4" />;
      case "doc": return <FileImage className="h-4 w-4" />;
      case "link": return <Link className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Card with all content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <CardTitle className="text-2xl">Course Materials</CardTitle>
              <CardDescription className="mt-1">
                Manage course materials including videos, PDFs, documents, and links
              </CardDescription>
            </div>
            <Button onClick={() => handleOpenDialog()} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Material
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Search Section */}
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search materials..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="text-sm text-muted-foreground">
              {filteredMaterials.length} {filteredMaterials.length === 1 ? "material" : "materials"} found
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Loading materials...</span>
            </div>
          )}

          {/* Table Section */}
          {!isLoading && filteredMaterials.length > 0 && (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMaterials
                    .sort((a, b) => a.orderIndex - b.orderIndex)
                    .map((material) => (
                    <TableRow key={material.materialId}>
                      <TableCell>
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-(--brand-blue)/10 text-(--brand-blue)">
                          {getMaterialIcon(material.type)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{material.title}</div>
                          <div className="text-sm text-muted-foreground truncate max-w-xs">
                            {material.url}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-muted capitalize">
                          {material.type}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm">
                        {material.course?.name || "Unknown Course"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-medium">{material.orderIndex}</span>
                          <div className="flex flex-col">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-4 w-4 p-0"
                              onClick={() => handleReorder(material.materialId, "up")}
                            >
                              <ArrowUp className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-4 w-4 p-0"
                              onClick={() => handleReorder(material.materialId, "down")}
                            >
                              <ArrowDown className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(material.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem
                              onClick={() => handleOpenDialog(material)}
                              className="cursor-pointer"
                            >
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => window.open(material.url, '_blank')}
                              className="cursor-pointer"
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Material
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setDeletingMaterial(material);
                                setIsDeleteDialogOpen(true);
                              }}
                              className="cursor-pointer text-destructive focus:text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && filteredMaterials.length === 0 && (
            <div className="text-center py-12 border rounded-md">
              <p className="text-muted-foreground">
                {searchTerm ? "No materials found matching your search." : "No materials yet. Create your first material."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingMaterial ? "Edit Material" : "Create New Material"}
            </DialogTitle>
            <DialogDescription>
              {editingMaterial
                ? "Update the material information below."
                : "Fill in the details to create a new material."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => {
                    setFormData({ ...formData, title: e.target.value });
                    setError(null);
                  }}
                  placeholder="Enter material title"
                  disabled={isSaving}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: "video" | "pdf" | "doc" | "link") =>
                    setFormData({ ...formData, type: value })
                  }
                  disabled={isSaving}
                >
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="doc">Document</SelectItem>
                    <SelectItem value="link">Link</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="url">URL *</Label>
              <Input
                id="url"
                type="url"
                value={formData.url}
                onChange={(e) => {
                  setFormData({ ...formData, url: e.target.value });
                  setError(null);
                }}
                placeholder="Enter material URL"
                disabled={isSaving}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="course">Course *</Label>
                <Select
                  value={formData.courseId}
                  onValueChange={(value) => setFormData({ ...formData, courseId: value })}
                  disabled={isSaving}
                >
                  <SelectTrigger id="course">
                    <SelectValue placeholder="Select course" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem key={course.courseId} value={course.courseId}>
                        {course.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="orderIndex">Order Index</Label>
                <Input
                  id="orderIndex"
                  type="number"
                  min="1"
                  value={formData.orderIndex}
                  onChange={(e) => setFormData({ ...formData, orderIndex: e.target.value })}
                  placeholder="Auto-assigned if empty"
                  disabled={isSaving}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsDialogOpen(false);
                setError(null);
                setSuccessMessage(null);
              }}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={!formData.title.trim() || !formData.url.trim() || !formData.courseId || isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {editingMaterial ? "Updating..." : "Creating..."}
                </>
              ) : (
                editingMaterial ? "Update" : "Create"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Material</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{deletingMaterial?.title}&quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {/* Error Message in Delete Dialog */}
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setError(null);
              }}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
