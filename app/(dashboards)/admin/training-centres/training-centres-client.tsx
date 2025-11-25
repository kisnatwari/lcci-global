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
import { Plus, Search, MoreVertical, Pencil, Trash2, Building2, Loader2, AlertCircle, CheckCircle2, GraduationCap, School, Copy, Check } from "lucide-react";
import { apiClient, ENDPOINTS } from "@/lib/api";

type TrainingCentreCategory = "SQA" | "Cambridge";

type TrainingCentre = {
  centreId: string;
  name: string;
  description: string;
  category: TrainingCentreCategory;
  centreUniqueIdentifier?: string | null;
  createdAt: string;
};

interface TrainingCentresPageClientProps {
  initialTrainingCentres: TrainingCentre[];
  error: string | null;
}

export function TrainingCentresPageClient({ initialTrainingCentres, error: initialError }: TrainingCentresPageClientProps) {
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
        console.log("Update response:", response);
        setSuccessMessage("Training centre updated successfully!");
      } else {
        // Create new centre
        const response = await apiClient.post(ENDPOINTS.trainingCentres.post(), payload);
        console.log("Create response:", response);
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
      
      console.log("Training centre deleted successfully");
    } catch (err: any) {
      console.error("Failed to delete training centre:", err);
      setError(err.message || "Failed to delete training centre");
    } finally {
      setIsSaving(false);
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
                          {centre.category}
                        </span>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { value: "SQA", label: "SQA", icon: School, color: "emerald" },
                  { value: "Cambridge", label: "Cambridge", icon: GraduationCap, color: "blue" },
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
                      className={`relative p-4 rounded-lg border-2 transition-all duration-200 ${borderBgClasses} ${
                        isSaving ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:shadow-sm"
                      }`}
                    >
                      {isSelected && (
                        <div className={`absolute top-2 right-2 w-4 h-4 rounded-full ${checkBgClasses} flex items-center justify-center`}>
                          <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                        </div>
                      )}
                      <div className="flex items-center gap-3">
                        <div className={`flex items-center justify-center w-10 h-10 rounded-lg flex-shrink-0 transition-colors ${iconBgClasses}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className={`font-semibold text-sm ${textClasses}`}>
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
    </div>
  );
}

