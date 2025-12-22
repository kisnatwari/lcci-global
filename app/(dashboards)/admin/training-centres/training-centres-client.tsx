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
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, Search, MoreVertical, Pencil, Trash2, Building2, Loader2, AlertCircle, CheckCircle2, GraduationCap, School, Copy, Check, Brain, Users, X, Calendar, User, CreditCard, CheckCircle as CheckCircleIcon } from "lucide-react";
import { apiClient, ENDPOINTS } from "@/lib/api";

type TrainingCentreCategory = "SQA" | "Cambridge" | "SoftSkill";

type TrainingCentre = {
  centreId: string;
  name: string;
  description: string | null;
  category: TrainingCentreCategory;
  centreUniqueIdentifier?: string | null;
  createdAt: string;
  totalEnrolledStudents: number;
};

interface TrainingCentresPageClientProps {
  initialTrainingCentres: TrainingCentre[];
  error: string | null;
}

export function TrainingCentresPageClient({ initialTrainingCentres, error: initialError }: TrainingCentresPageClientProps) {
  console.log("initialTrainingCentres", initialTrainingCentres);
  const [trainingCentres, setTrainingCentres] = useState<TrainingCentre[]>(initialTrainingCentres);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingCentre, setEditingCentre] = useState<TrainingCentre | null>(null);
  const [deletingCentre, setDeletingCentre] = useState<TrainingCentre | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "Cambridge" as TrainingCentreCategory,
    centreUniqueIdentifier: "",
  });

  // Loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(initialError);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Enrollments drawer state
  const [isEnrollmentsDrawerOpen, setIsEnrollmentsDrawerOpen] = useState(false);
  const [selectedCentreForEnrollments, setSelectedCentreForEnrollments] = useState<TrainingCentre | null>(null);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [enrollmentsTotal, setEnrollmentsTotal] = useState(0);
  const [isLoadingEnrollments, setIsLoadingEnrollments] = useState(false);
  const [enrollmentsError, setEnrollmentsError] = useState<string | null>(null);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Fetch training centres from API (for refresh)
  const fetchTrainingCentres = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get(ENDPOINTS.trainingCentres.get());
      // Handle API response format: { success, message, data: { trainingCentres: [...], total } }
      if (response.success && response.data && Array.isArray(response.data.trainingCentres)) {
        setTrainingCentres(response.data.trainingCentres);
      } else if (response.data && Array.isArray(response.data.trainingCentres)) {
        setTrainingCentres(response.data.trainingCentres);
      } else if (response.trainingCentres && Array.isArray(response.trainingCentres)) {
        setTrainingCentres(response.trainingCentres);
      } else if (Array.isArray(response)) {
        setTrainingCentres(response);
      } else {
        setTrainingCentres([]);
      }
    } catch (err: any) {
      console.error("Failed to fetch training centres:", err);
      setError(err.message || "Failed to load training centres");
      setTrainingCentres([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter training centres based on search
  const filteredTrainingCentres = trainingCentres.filter(
    (centre) =>
      centre.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (centre.description && centre.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      centre.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle create/edit dialog open
  const handleOpenDialog = (centre?: TrainingCentre) => {
    setError(null);
    setSuccessMessage(null);
    if (centre) {
      setEditingCentre(centre);
      setFormData({
        name: centre.name || "",
        description: centre.description || "",
        category: centre.category,
        centreUniqueIdentifier: centre.centreUniqueIdentifier || "",
      });
    } else {
      setEditingCentre(null);
      setFormData({
        name: "",
        description: "",
        category: "Cambridge",
        centreUniqueIdentifier: "",
      });
    }
    setIsDialogOpen(true);
  };

  // Handle save (create or update)
  const handleSave = async () => {
    if (!formData.name || !formData.name.trim()) {
      setError("Training centre name is required");
      return;
    }

    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const payload = {
        name: formData.name.trim(),
        description: (formData.description && formData.description.trim()) || undefined,
        category: formData.category,
        centreUniqueIdentifier: (formData.centreUniqueIdentifier && formData.centreUniqueIdentifier.trim()) || undefined,
      };

      if (editingCentre) {
        // Update existing centre
        const response = await apiClient.put(ENDPOINTS.trainingCentres.update(editingCentre.centreId), payload);
        setSuccessMessage("Training centre updated successfully!");
      } else {
        // Create new centre
        const response = await apiClient.post(ENDPOINTS.trainingCentres.post(), payload);
        setSuccessMessage("Training centre created successfully!");
      }

      // Refresh the list
      await fetchTrainingCentres();

      // Close dialog after a short delay to show success message
      setTimeout(() => {
        setIsDialogOpen(false);
        setEditingCentre(null);
        setFormData({
          name: "",
          description: "",
          category: "Cambridge",
          centreUniqueIdentifier: "",
        });
        setSuccessMessage(null);
      }, 1000);
    } catch (err: any) {
      console.error("Failed to save training centre:", err);
      const errorMessage = err.message || 
                          (err.response?.data?.message) ||
                          (editingCentre ? "Failed to update training centre" : "Failed to create training centre");
      setError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!deletingCentre) return;

    setIsSaving(true);
    setError(null);

    try {
      await apiClient.delete(ENDPOINTS.trainingCentres.delete(deletingCentre.centreId));
      
      // Remove from local state
      setTrainingCentres(trainingCentres.filter((centre) => centre.centreId !== deletingCentre.centreId));
      
      // Close dialog
      setIsDeleteDialogOpen(false);
      setDeletingCentre(null);
    } catch (err: any) {
      console.error("Failed to delete training centre:", err);
      setError(err.message || "Failed to delete training centre");
    } finally {
      setIsSaving(false);
    }
  };

  // Get category display label
  const getCategoryLabel = (category: TrainingCentreCategory): string => {
    switch (category) {
      case "SQA":
        return "IT & Hospitality Management";
      case "Cambridge":
        return "Cambridge";
      case "SoftSkill":
        return "Soft Skill";
      default:
        return category;
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

  // Copy unique identifier to clipboard
  const handleCopyIdentifier = async (identifier: string, centreId: string) => {
    try {
      await navigator.clipboard.writeText(identifier);
      setCopiedId(centreId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // Handle opening enrollments drawer
  const handleViewEnrollments = async (centre: TrainingCentre) => {
    setSelectedCentreForEnrollments(centre);
    setIsEnrollmentsDrawerOpen(true);
    setIsLoadingEnrollments(true);
    setEnrollmentsError(null);
    
    try {
      // Use the enrollments endpoint with trainingCenterId query parameter
      const response = await apiClient.get(ENDPOINTS.enrollments.get({ trainingCenterId: centre.centreId }));
      
      // Handle response - pretty print whatever we get
      console.log("Enrollments response:", response);
      
      // Handle different response formats
      let enrollmentsData: any[] = [];
      let total = 0;
      
      if (response.enrollments && Array.isArray(response.enrollments)) {
        enrollmentsData = response.enrollments;
        total = response.total || enrollmentsData.length;
      } else if (response.success && response.data) {
        if (response.data.enrollments && Array.isArray(response.data.enrollments)) {
          enrollmentsData = response.data.enrollments;
          total = response.data.total || enrollmentsData.length;
        } else if (Array.isArray(response.data)) {
          enrollmentsData = response.data;
          total = enrollmentsData.length;
        }
      } else if (Array.isArray(response)) {
        enrollmentsData = response;
        total = enrollmentsData.length;
      } else {
        // If it's not an array, store the whole response as a single item for display
        enrollmentsData = [response];
        total = 1;
      }
      
      setEnrollments(enrollmentsData);
      setEnrollmentsTotal(total);
    } catch (err: any) {
      console.error("Failed to fetch enrollments:", err);
      setEnrollmentsError(err.message || "Failed to load enrollments");
      setEnrollments([]);
    } finally {
      setIsLoadingEnrollments(false);
    }
  };

  // Helper to get user name from enrollment
  const getUserName = (user: any): string => {
    if (!user) return "Unknown";
    if (user.profile) {
      const firstName = user.profile.firstName || "";
      const lastName = user.profile.lastName || "";
      if (firstName || lastName) {
        return `${firstName} ${lastName}`.trim();
      }
    }
    return user.email || "Unknown User";
  };

  // Helper to get status badge colors
  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "enrolled":
        return {
          bg: "bg-blue-50",
          text: "text-blue-700",
          border: "border-blue-200",
        };
      case "completed":
        return {
          bg: "bg-emerald-50",
          text: "text-emerald-700",
          border: "border-emerald-200",
        };
      case "cancelled":
        return {
          bg: "bg-red-50",
          text: "text-red-700",
          border: "border-red-200",
        };
      default:
        return {
          bg: "bg-slate-50",
          text: "text-slate-700",
          border: "border-slate-200",
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Card with all content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <CardTitle className="text-2xl">Training Centres</CardTitle>
              <CardDescription className="mt-1">
                Manage training centres and their configurations
              </CardDescription>
            </div>
            <Button onClick={() => handleOpenDialog()} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Centre
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
                placeholder="Search training centres..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="text-sm text-muted-foreground">
              {filteredTrainingCentres.length} {filteredTrainingCentres.length === 1 ? "centre" : "centres"} found
            </div>
          </div>

          {/* Error State */}
          {error && !isLoading && (
            <div className="flex items-center gap-2 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <div>
                <p className="font-medium">Failed to load training centres</p>
                <p className="text-sm">{error}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchTrainingCentres}
                className="ml-auto"
              >
                Retry
              </Button>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Loading training centres...</span>
            </div>
          )}

          {/* Table Section */}
          {!isLoading && !error && filteredTrainingCentres.length > 0 && (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Enrolled Students</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTrainingCentres.map((centre) => (
                    <TableRow key={centre.centreId}>
                      <TableCell>
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-(--brand-blue)/10 text-(--brand-blue)">
                          <Building2 className="h-4 w-4" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{centre.name}</div>
                        {centre.centreUniqueIdentifier && (
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className="font-mono text-xs text-muted-foreground">{centre.centreUniqueIdentifier}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-5 w-5 p-0 hover:bg-muted"
                              onClick={() => handleCopyIdentifier(centre.centreUniqueIdentifier!, centre.centreId)}
                              title="Copy identifier"
                            >
                              {copiedId === centre.centreId ? (
                                <Check className="h-3 w-3 text-green-600" />
                              ) : (
                                <Copy className="h-3 w-3 text-muted-foreground" />
                              )}
                            </Button>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground max-w-md">
                        {centre.description || <span className="text-muted-foreground/50">No description</span>}
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-muted">
                          {getCategoryLabel(centre.category)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{centre.totalEnrolledStudents || 0}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {formatDate(centre.createdAt)}
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
                              onClick={() => handleOpenDialog(centre)}
                              className="cursor-pointer"
                            >
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleViewEnrollments(centre)}
                              className="cursor-pointer"
                            >
                              <Users className="mr-2 h-4 w-4" />
                              View Enrollments
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => {
                                setDeletingCentre(centre);
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
          {!isLoading && !error && filteredTrainingCentres.length === 0 && (
            <div className="text-center py-12 border rounded-md">
              <p className="text-muted-foreground">
                {searchTerm ? "No training centres found matching your search." : "No training centres yet. Create your first training centre."}
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
              {editingCentre ? "Edit Training Centre" : "Create New Training Centre"}
            </DialogTitle>
            <DialogDescription>
              {editingCentre
                ? "Update the training centre information below."
                : "Fill in the details to create a new training centre."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
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

            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  setError(null); // Clear error when user types
                }}
                placeholder="Enter training centre name"
                disabled={isSaving}
              />
            </div>

            <div className="space-y-2.5">
              <Label className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                Category <span className="text-red-500 font-bold">*</span>
              </Label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: "SQA", label: "IT & Hospitality Management", icon: School, color: "emerald" },
                  { value: "Cambridge", label: "Cambridge", icon: GraduationCap, color: "blue" },
                  { value: "SoftSkill", label: "Soft Skill", icon: Brain, color: "purple" },
                ].map((category) => {
                  const isSelected = formData.category === category.value;
                  const Icon = category.icon;
                  
                  let borderBgClasses = "";
                  let iconBgClasses = "";
                  let textClasses = "";
                  let checkBgClasses = "";
                  
                  if (category.color === "emerald") {
                    borderBgClasses = isSelected ? "border-emerald-500 bg-emerald-50" : "border-slate-300 hover:border-emerald-300";
                    iconBgClasses = isSelected ? "bg-emerald-500 text-white" : "bg-emerald-100 text-emerald-600";
                    textClasses = isSelected ? "text-emerald-700" : "text-slate-900";
                    checkBgClasses = "bg-emerald-500";
                  } else if (category.color === "blue") {
                    borderBgClasses = isSelected ? "border-blue-500 bg-blue-50" : "border-slate-300 hover:border-blue-300";
                    iconBgClasses = isSelected ? "bg-blue-500 text-white" : "bg-blue-100 text-blue-600";
                    textClasses = isSelected ? "text-blue-700" : "text-slate-900";
                    checkBgClasses = "bg-blue-500";
                  } else if (category.color === "purple") {
                    borderBgClasses = isSelected ? "border-purple-500 bg-purple-50" : "border-slate-300 hover:border-purple-300";
                    iconBgClasses = isSelected ? "bg-purple-500 text-white" : "bg-purple-100 text-purple-600";
                    textClasses = isSelected ? "text-purple-700" : "text-slate-900";
                    checkBgClasses = "bg-purple-500";
                  }
                  
                  return (
                    <button
                      key={category.value}
                      type="button"
                      onClick={() => {
                        if (!isSaving) {
                          setFormData({ ...formData, category: category.value as TrainingCentreCategory });
                        }
                      }}
                      disabled={isSaving}
                      className={`relative p-4 rounded-lg border-2 transition-all duration-200 min-h-[80px] ${borderBgClasses} ${
                        isSaving ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:shadow-sm"
                      }`}
                    >
                      {isSelected && (
                        <div className={`absolute top-2 right-2 w-4 h-4 rounded-full ${checkBgClasses} flex items-center justify-center`}>
                          <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                        </div>
                      )}
                      <div className="flex items-start gap-3 pr-6">
                        <div className={`flex items-center justify-center w-10 h-10 rounded-lg shrink-0 transition-colors ${iconBgClasses}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className={`font-semibold text-sm leading-tight ${textClasses} break-words`}>
                          {category.label}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="centreUniqueIdentifier">Centre Unique Identifier</Label>
              <Input
                id="centreUniqueIdentifier"
                value={formData.centreUniqueIdentifier}
                onChange={(e) => {
                  setFormData({ ...formData, centreUniqueIdentifier: e.target.value });
                  setError(null);
                }}
                placeholder="Enter centre unique identifier"
                disabled={isSaving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter training centre description"
                rows={3}
                disabled={isSaving}
              />
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
              disabled={!formData.name.trim() || isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {editingCentre ? "Updating..." : "Creating..."}
                </>
              ) : (
                editingCentre ? "Update" : "Create"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Training Centre</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{deletingCentre?.name}&quot;? This action cannot be undone.
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

      {/* Enrollments Drawer */}
      <Drawer open={isEnrollmentsDrawerOpen} onOpenChange={setIsEnrollmentsDrawerOpen} direction="right">
        <DrawerContent className="md:min-w-[500px] lg:min-w-[600px] 2xl:min-w-[800px]">
          <DrawerHeader className="border-b">
            <div className="flex items-center justify-between">
              <div>
                <DrawerTitle>Training Centre Enrollments</DrawerTitle>
                <DrawerDescription>
                  {selectedCentreForEnrollments?.name}
                </DrawerDescription>
              </div>
              <DrawerClose asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <X className="h-4 w-4" />
                </Button>
              </DrawerClose>
            </div>
          </DrawerHeader>

          <div className="flex-1 overflow-y-auto p-6">
            {isLoadingEnrollments ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">Loading enrollments...</span>
              </div>
            ) : enrollmentsError ? (
              <div className="flex items-center gap-2 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <div>
                  <p className="font-medium">Failed to load enrollments</p>
                  <p className="text-sm">{enrollmentsError}</p>
                </div>
              </div>
            ) : enrollments.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No enrollments found for this training centre.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {enrollments.map((enrollment, index) => {
                  // Handle different response formats - pretty print whatever we get
                  const enrollmentId = enrollment.enrollmentId || enrollment.id || `enrollment-${index}`;
                  const status = enrollment.status || "unknown";
                  const statusColors = getStatusBadge(status);
                  
                  return (
                    <div
                      key={enrollmentId}
                      className="border rounded-lg p-4 space-y-3 hover:bg-slate-50 transition-colors"
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          {enrollment.user ? (
                            <div className="flex items-center gap-3 mb-2">
                              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[color:var(--brand-blue)]/10 text-[color:var(--brand-blue)]">
                                <User className="h-5 w-5" />
                              </div>
                              <div>
                                <p className="font-semibold text-slate-900">
                                  {getUserName(enrollment.user)}
                                </p>
                                <p className="text-sm text-slate-600">{enrollment.user?.email || "—"}</p>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-3 mb-2">
                              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 text-slate-600">
                                <User className="h-5 w-5" />
                              </div>
                              <div>
                                <p className="font-semibold text-slate-900">Enrollment #{index + 1}</p>
                                <p className="text-sm text-slate-600">ID: {enrollmentId}</p>
                              </div>
                            </div>
                          )}
                        </div>
                        {status && (
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors.bg} ${statusColors.text} border ${statusColors.border}`}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </span>
                        )}
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        {enrollment.enrolledAt && (
                          <div className="flex items-center gap-2 text-slate-600">
                            <Calendar className="h-4 w-4 text-slate-400" />
                            <span>
                              <span className="text-slate-500">Enrolled:</span>{" "}
                              {formatDate(enrollment.enrolledAt)}
                            </span>
                          </div>
                        )}
                        {enrollment.completedAt && (
                          <div className="flex items-center gap-2 text-slate-600">
                            <CheckCircleIcon className="h-4 w-4 text-emerald-500" />
                            <span>
                              <span className="text-slate-500">Completed:</span>{" "}
                              {formatDate(enrollment.completedAt)}
                            </span>
                          </div>
                        )}
                        {enrollment.transaction && (
                          <div className="flex items-center gap-2 text-slate-600 col-span-2">
                            <CreditCard className="h-4 w-4 text-slate-400" />
                            <span>
                              <span className="text-slate-500">Payment:</span>{" "}
                              {enrollment.transaction.amount !== undefined && (
                                <>NPR {Number(enrollment.transaction.amount || 0).toLocaleString()}</>
                              )}
                              {enrollment.transaction.paymentType && (
                                <> ({enrollment.transaction.paymentType})</>
                              )}
                              {enrollment.transaction.status && (
                                <span className={`ml-2 px-2 py-0.5 rounded text-xs font-medium ${
                                  enrollment.transaction.status === 'completed' || enrollment.transaction.status === 'success'
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : enrollment.transaction.status === 'pending'
                                    ? 'bg-amber-100 text-amber-700'
                                    : 'bg-red-100 text-red-700'
                                }`}>
                                  {enrollment.transaction.status}
                                </span>
                              )}
                            </span>
                          </div>
                        )}
                        {enrollment.isLcci !== undefined && (
                          <div className="flex items-center gap-2 text-slate-600">
                            <span className="text-slate-500">LCCI:</span>{" "}
                            <span className={enrollment.isLcci ? "text-emerald-600 font-medium" : "text-slate-400"}>
                              {enrollment.isLcci ? "Yes" : "No"}
                            </span>
                          </div>
                        )}
                        {enrollment.progress !== undefined && (
                          <div className="flex items-center gap-2 text-slate-600">
                            <span className="text-slate-500">Progress:</span>{" "}
                            <span className="font-medium">{enrollment.progress}%</span>
                          </div>
                        )}
                      </div>

                      {/* Progress Bar */}
                      {enrollment.progress !== undefined && (
                        <div className="space-y-1">
                          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[color:var(--brand-blue)] transition-all"
                              style={{ width: `${enrollment.progress}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Course Info */}
                      {enrollment.course && (
                        <div className="pt-2 border-t">
                          <p className="text-xs text-slate-500 mb-2">Course:</p>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-slate-900">{enrollment.course.name || enrollment.course.title || "—"}</span>
                            {enrollment.course.courseId && (
                              <span className="text-xs text-slate-500">({enrollment.course.courseId})</span>
                            )}
                          </div>
                        </div>
                      )}

                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <DrawerFooter className="border-t">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {enrollmentsTotal} {enrollmentsTotal === 1 ? "enrollment" : "enrollments"}
              </p>
              <DrawerClose asChild>
                <Button variant="outline">Close</Button>
              </DrawerClose>
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

