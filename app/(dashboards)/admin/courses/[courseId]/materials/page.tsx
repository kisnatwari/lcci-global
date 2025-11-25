"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
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
import { ArrowLeft, Plus, MoreVertical, Search, FileText, Pencil, Eye, Trash2, Loader2, AlertCircle, CheckCircle2, Video, FileImage, Link, ArrowUp, ArrowDown, BookOpen, Upload, X as XIcon } from "lucide-react";
import { apiClient, ENDPOINTS } from "@/lib/api";
import { getCourseMaterials, createMaterial, updateMaterial, deleteMaterial, type CourseMaterial, type CreateMaterialPayload } from "@/lib/api/materials";

// CourseMaterial type is now imported from API

type Course = {
  courseId: string;
  name: string;
  description?: string;
  thumbnailUrl?: string | null;
  category?: {
    categoryId: string;
    name: string;
  };
  level?: "beginner" | "intermediate" | "advanced";
};

export default function CourseMaterialsPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.courseId as string;

  const [materials, setMaterials] = useState<CourseMaterial[]>([]);
  const [course, setCourse] = useState<Course | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<CourseMaterial | null>(null);
  const [deletingMaterial, setDeletingMaterial] = useState<CourseMaterial | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    fileUrl: "",
    type: "video" as "video" | "pdf" | "doc" | "link",
    orderIndex: "",
  });
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  // Loading and error states
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Fetch data on mount
  useEffect(() => {
    fetchCourse();
    fetchMaterials();
  }, [courseId]);

  // Fetch course details
  const fetchCourse = async () => {
    try {
      const response = await apiClient.get(ENDPOINTS.courses.getById(courseId));
      const data = response.data || response;
      setCourse({
        courseId: data.courseId,
        name: data.name,
        description: data.description,
        thumbnailUrl: data.thumbnailUrl,
        category: data.category,
        level: data.level,
      });
    } catch (err: any) {
      console.error("Failed to fetch course:", err);
    }
  };

  // Fetch materials from API
  const fetchMaterials = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getCourseMaterials(courseId);
      setMaterials(data);
    } catch (err: any) {
      console.error("Failed to fetch materials:", err);
      setError(err.message || "Failed to load materials");
      setMaterials([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter materials based on search
  const filteredMaterials = materials.filter(
    (material) =>
      material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle file upload
  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setError(null);
    
    try {
      const response = await apiClient.upload(ENDPOINTS.upload.file(), file);
      
      if (response.url) {
        setFormData({ ...formData, fileUrl: response.url });
        setUploadedFileName(response.fileName || file.name);
        setSuccessMessage("File uploaded successfully!");
      } else {
        setError("Upload failed: No URL returned");
      }
    } catch (err: any) {
      console.error("File upload error:", err);
      setError(err.message || "Failed to upload file. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
    // Reset input so same file can be selected again
    e.target.value = "";
  };

  // Handle create/edit dialog open
  const handleOpenDialog = (material?: CourseMaterial) => {
    setError(null);
    setSuccessMessage(null);
    setUploadedFileName(null);
    if (material) {
      setEditingMaterial(material);
      setFormData({
        title: material.title || "",
        description: material.description || "",
        fileUrl: material.fileUrl || "",
        type: material.type,
        orderIndex: material.orderIndex?.toString() || "",
      });
    } else {
      setEditingMaterial(null);
      setFormData({
        title: "",
        description: "",
        fileUrl: "",
        type: "video",
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

    if (!formData.fileUrl || !formData.fileUrl.trim()) {
      setError("Material file URL is required");
      return;
    }

    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const payload: CreateMaterialPayload = {
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        fileUrl: formData.fileUrl.trim(),
        type: formData.type,
      };

      if (editingMaterial) {
        // Update existing material
        await updateMaterial(courseId, editingMaterial.materialId, payload);
        setSuccessMessage("Material updated successfully!");
      } else {
        // Create new material
        await createMaterial(courseId, payload);
        setSuccessMessage("Material created successfully!");
      }

      // Refresh materials list
      await fetchMaterials();

      // Close dialog after a short delay to show success message
      setTimeout(() => {
        setIsDialogOpen(false);
        setEditingMaterial(null);
        setFormData({
          title: "",
          description: "",
          fileUrl: "",
          type: "video",
          orderIndex: "",
        });
        setUploadedFileName(null);
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
      // Delete material
      await deleteMaterial(courseId, deletingMaterial.materialId);
      
      // Refresh materials list
      await fetchMaterials();
      
      // Close dialog
      setIsDeleteDialogOpen(false);
      setDeletingMaterial(null);
      setSuccessMessage("Material deleted successfully!");
      
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err: any) {
      console.error("Failed to delete material:", err);
      setError(err.message || "Failed to delete material");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle reorder
  const handleReorder = async (materialId: string, direction: "up" | "down") => {
    const material = materials.find(m => m.materialId === materialId);
    if (!material) return;

    const sortedMaterials = [...materials].sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
    const currentIndex = sortedMaterials.findIndex(m => m.materialId === materialId);
    
    if (direction === "up" && currentIndex > 0) {
      const targetMaterial = sortedMaterials[currentIndex - 1];
      const newOrderIndex = targetMaterial.orderIndex;
      const oldOrderIndex = material.orderIndex;

      try {
        // Swap order indices
        await updateMaterial(courseId, materialId, {
          orderIndex: newOrderIndex,
        });
        await updateMaterial(courseId, targetMaterial.materialId, {
          orderIndex: oldOrderIndex,
        });
        await fetchMaterials();
      } catch (err: any) {
        console.error("Failed to reorder material:", err);
        setError("Failed to reorder material");
      }
    } else if (direction === "down" && currentIndex < sortedMaterials.length - 1) {
      const targetMaterial = sortedMaterials[currentIndex + 1];
      const newOrderIndex = targetMaterial.orderIndex;
      const oldOrderIndex = material.orderIndex;

      try {
        // Swap order indices
        await updateMaterial(courseId, materialId, {
          orderIndex: newOrderIndex,
        });
        await updateMaterial(courseId, targetMaterial.materialId, {
          orderIndex: oldOrderIndex,
        });
        await fetchMaterials();
      } catch (err: any) {
        console.error("Failed to reorder material:", err);
        setError("Failed to reorder material");
      }
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
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <Button
            variant="ghost"
            onClick={() => router.push(`/admin/courses/${courseId}`)}
            className="mb-4 text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Course
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Course Materials
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              {course ? `Managing materials for: ${course.name}` : "Loading course..."}
            </p>
          </div>
        </div>
        <Button onClick={() => handleOpenDialog()} className="gap-2 shrink-0">
          <Plus className="h-4 w-4" />
          Add Material
        </Button>
      </div>

      {/* Main Card with all content */}
      <Card>
        <CardContent className="space-y-6 pt-6">
          {/* Feedback Messages */}
          {(successMessage || error) && (
            <div className="space-y-3">
              {successMessage && (
                <div className="flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />
                  <div>
                    <p className="font-semibold">{successMessage}</p>
                    <p className="text-xs text-emerald-700">Your changes have been saved successfully.</p>
                  </div>
                </div>
              )}
              {error && (
                <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                  <AlertCircle className="mt-0.5 h-4 w-4" />
                  <div>
                    <p className="font-semibold">Action required</p>
                    <p className="text-xs text-destructive">{error}</p>
                  </div>
                </div>
              )}
            </div>
          )}

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
                    <TableHead>Order</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMaterials
                    .sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0))
                    .map((material) => (
                    <TableRow key={material.materialId}>
                      <TableCell>
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[color:var(--brand-blue)]/10 text-[color:var(--brand-blue)]">
                          {getMaterialIcon(material.type)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{material.title}</div>
                          {material.description && (
                            <div className="text-sm text-muted-foreground line-clamp-1 max-w-xs">
                              {material.description}
                            </div>
                          )}
                          <div className="text-xs text-muted-foreground truncate max-w-xs mt-1">
                            {material.fileUrl}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-muted capitalize">
                          {material.type}
                        </span>
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
                        {material.createdAt ? formatDate(material.createdAt) : "—"}
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
                              onClick={() => window.open(material.fileUrl, '_blank')}
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
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-4 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[color:var(--brand-blue)]/10">
                {editingMaterial ? (
                  <Pencil className="w-6 h-6 text-[color:var(--brand-blue)]" />
                ) : (
                  <Plus className="w-6 h-6 text-[color:var(--brand-blue)]" />
                )}
              </div>
              <div className="flex-1">
                <DialogTitle className="text-2xl font-bold text-slate-900">
                  {editingMaterial ? "Edit Material" : "Create New Material"}
                </DialogTitle>
                <DialogDescription className="mt-1.5 text-slate-600">
                  {editingMaterial
                    ? "Update the material information below."
                    : "Fill in the details to create a new material for this course."}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          
          <div className="space-y-6 py-6">
            {/* Error Message */}
            {error && (
              <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border-2 border-red-200 text-red-700">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Error</p>
                  <p className="text-sm mt-1">{error}</p>
                </div>
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-50 border-2 border-emerald-200 text-emerald-700">
                <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Success</p>
                  <p className="text-sm mt-1">{successMessage}</p>
                </div>
              </div>
            )}

            {/* Form Fields */}
            <div className="space-y-6">
              {/* Title Field */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-slate-500" />
                  Material Title
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => {
                    setFormData({ ...formData, title: e.target.value });
                    setError(null);
                  }}
                  placeholder="e.g., Introduction to Leadership Communication"
                  disabled={isSaving}
                  className="h-11 text-base"
                />
                <p className="text-xs text-slate-500">Enter a descriptive title for this material</p>
              </div>

              {/* Description Field */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-slate-500" />
                  Description
                </Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => {
                    setFormData({ ...formData, description: e.target.value });
                    setError(null);
                  }}
                  placeholder="e.g., PDF covering basics of financial management"
                  disabled={isSaving}
                  className="h-11 text-base"
                />
                <p className="text-xs text-slate-500">Optional description for this material</p>
              </div>

              {/* Material Type Selection - Icon Cards */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  Material Type
                  <span className="text-red-500">*</span>
                </Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { value: "video" as const, label: "Video", icon: Video, color: "blue" },
                    { value: "pdf" as const, label: "PDF", icon: FileText, color: "red" },
                    { value: "doc" as const, label: "Document", icon: FileImage, color: "purple" },
                    { value: "link" as const, label: "Link", icon: Link, color: "green" },
                  ].map((type) => {
                    const isSelected = formData.type === type.value;
                    const Icon = type.icon;
                    
                    let borderBgClasses = "";
                    let iconBgClasses = "";
                    let textClasses = "";
                    let checkBgClasses = "";
                    
                    if (type.color === "blue") {
                      borderBgClasses = isSelected ? "border-[color:var(--brand-blue)] bg-[color:var(--brand-blue)]/5" : "border-slate-300 hover:border-[color:var(--brand-blue)]/50";
                      iconBgClasses = isSelected ? "bg-[color:var(--brand-blue)] text-white" : "bg-blue-100 text-blue-600";
                      textClasses = isSelected ? "text-[color:var(--brand-blue)]" : "text-slate-900";
                      checkBgClasses = "bg-[color:var(--brand-blue)]";
                    } else if (type.color === "red") {
                      borderBgClasses = isSelected ? "border-red-500 bg-red-50" : "border-slate-300 hover:border-red-300";
                      iconBgClasses = isSelected ? "bg-red-500 text-white" : "bg-red-100 text-red-600";
                      textClasses = isSelected ? "text-red-700" : "text-slate-900";
                      checkBgClasses = "bg-red-500";
                    } else if (type.color === "purple") {
                      borderBgClasses = isSelected ? "border-purple-500 bg-purple-50" : "border-slate-300 hover:border-purple-300";
                      iconBgClasses = isSelected ? "bg-purple-500 text-white" : "bg-purple-100 text-purple-600";
                      textClasses = isSelected ? "text-purple-700" : "text-slate-900";
                      checkBgClasses = "bg-purple-500";
                    } else if (type.color === "green") {
                      borderBgClasses = isSelected ? "border-green-500 bg-green-50" : "border-slate-300 hover:border-green-300";
                      iconBgClasses = isSelected ? "bg-green-500 text-white" : "bg-green-100 text-green-600";
                      textClasses = isSelected ? "text-green-700" : "text-slate-900";
                      checkBgClasses = "bg-green-500";
                    }
                    
                    return (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => {
                          if (!isSaving) {
                            // Clear uploaded file when changing type
                            if (formData.type !== type.value) {
                              setUploadedFileName(null);
                              setFormData({ ...formData, type: type.value, fileUrl: "" });
                            } else {
                              setFormData({ ...formData, type: type.value });
                            }
                            setError(null);
                          }
                        }}
                        disabled={isSaving}
                        className={`relative p-4 rounded-lg border-2 transition-all duration-200 ${borderBgClasses} ${
                          isSaving ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:shadow-sm"
                        }`}
                      >
                        {isSelected && (
                          <div className={`absolute top-2 right-2 w-4 h-4 rounded-full ${checkBgClasses} flex items-center justify-center`}>
                            <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                          </div>
                        )}
                        <div className="flex flex-col items-center gap-2">
                          <div className={`flex items-center justify-center w-10 h-10 rounded-lg flex-shrink-0 transition-colors ${iconBgClasses}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <span className={`font-semibold text-xs text-center ${textClasses}`}>
                            {type.label}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Order Index */}
              <div className="space-y-2">

                <div className="space-y-2">
                  <Label htmlFor="orderIndex" className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-slate-500" />
                    Order Index
                  </Label>
                  <Input
                    id="orderIndex"
                    type="number"
                    min="1"
                    value={formData.orderIndex}
                    onChange={(e) => setFormData({ ...formData, orderIndex: e.target.value })}
                    placeholder="Auto-assigned"
                    disabled={isSaving}
                    className="h-11 text-base"
                  />
                  <p className="text-xs text-slate-500">Lower numbers appear first</p>
                </div>
              </div>

              {/* URL Field with File Upload */}
              <div className="space-y-2">
                <Label htmlFor="url" className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <Link className="w-4 h-4 text-slate-500" />
                  Material URL
                  <span className="text-red-500">*</span>
                </Label>
                
                {/* File Upload Section */}
                {formData.type !== "link" && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <label
                        htmlFor="file-upload"
                        className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border-2 border-dashed transition-all cursor-pointer ${
                          isUploading
                            ? "border-slate-300 bg-slate-50 cursor-not-allowed"
                            : "border-[color:var(--brand-blue)]/30 bg-[color:var(--brand-blue)]/5 hover:border-[color:var(--brand-blue)]/50 hover:bg-[color:var(--brand-blue)]/10"
                        }`}
                      >
                        <input
                          id="file-upload"
                          type="file"
                          onChange={handleFileChange}
                          disabled={isUploading || isSaving}
                          className="hidden"
                          accept={
                            formData.type === "video"
                              ? "video/*"
                              : formData.type === "pdf"
                              ? "application/pdf"
                              : formData.type === "doc"
                              ? ".doc,.docx,.txt"
                              : "*"
                          }
                        />
                        {isUploading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin text-[color:var(--brand-blue)]" />
                            <span className="text-sm font-medium text-slate-700">Uploading...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4 text-[color:var(--brand-blue)]" />
                            <span className="text-sm font-medium text-[color:var(--brand-blue)]">
                              Upload File
                            </span>
                          </>
                        )}
                      </label>
                      {uploadedFileName && (
                        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-50 border border-emerald-200">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span className="text-sm font-medium text-emerald-700 truncate max-w-xs">
                            {uploadedFileName}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setUploadedFileName(null);
                              setFormData({ ...formData, fileUrl: "" });
                            }}
                            className="ml-1 p-1 hover:bg-emerald-100 rounded"
                          >
                            <XIcon className="w-3 h-3 text-emerald-600" />
                          </button>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-slate-500">
                      Upload a file or enter URL manually below
                    </p>
                  </div>
                )}
                
                {/* File URL Input */}
                <Input
                  id="fileUrl"
                  type="url"
                  value={formData.fileUrl}
                  onChange={(e) => {
                    setFormData({ ...formData, fileUrl: e.target.value });
                    setError(null);
                  }}
                  placeholder={formData.type === "link" ? "https://example.com/material" : "Upload file or enter URL"}
                  disabled={isSaving}
                  className="h-11 text-base font-mono"
                />
                <p className="text-xs text-slate-500">
                  {formData.type === "link"
                    ? "Enter the full URL to access this material"
                    : "File URL will be auto-filled after upload, or enter URL manually"}
                </p>
              </div>
            </div>
          </div>

          <DialogFooter className="pt-4 border-t border-slate-200 gap-3">
            <Button 
              variant="outline" 
              onClick={() => {
                setIsDialogOpen(false);
                setError(null);
                setSuccessMessage(null);
                setUploadedFileName(null);
              }}
              disabled={isSaving}
              className="h-11 px-6"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={!formData.title.trim() || !formData.fileUrl.trim() || isSaving}
              className="h-11 px-6 bg-[color:var(--brand-blue)] hover:bg-[color:var(--brand-blue)]/90 text-white font-semibold"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {editingMaterial ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>
                  {editingMaterial ? (
                    <>
                      <Pencil className="mr-2 h-4 w-4" />
                      Update Material
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Material
                    </>
                  )}
                </>
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

