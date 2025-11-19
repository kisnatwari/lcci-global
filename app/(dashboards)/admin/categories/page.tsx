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
import { Plus, Pencil, Trash2, Search, FolderTree, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { apiClient, ENDPOINTS } from "@/lib/api";

type Category = {
  categoryId: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ name: "", description: "" });
  
  // Loading and error states
  const [isLoading, setIsLoading] = useState(true); // Start with true to show loading initially
  const [isSaving, setIsSaving] = useState(false); // For both create and update
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch categories from API
  const fetchCategories = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get(ENDPOINTS.categories.get());
      // Handle API response format: { success, message, data: { categories: [...], total } }
      if (response.success && response.data && Array.isArray(response.data.categories)) {
        setCategories(response.data.categories);
      } else if (response.data && Array.isArray(response.data.categories)) {
        // Fallback: data.categories exists
        setCategories(response.data.categories);
      } else if (response.categories && Array.isArray(response.categories)) {
        // Fallback: categories at root level
        setCategories(response.categories);
      } else if (Array.isArray(response)) {
        // Fallback: direct array
        setCategories(response);
      } else {
        setCategories([]);
      }
    } catch (err: any) {
      console.error("Failed to fetch categories:", err);
      setError(err.message || "Failed to load categories");
      setCategories([]); // Set empty array on error
    } finally {
      setIsLoading(false);
    }
  };

  // Filter categories based on search
  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Handle create/edit dialog open
  const handleOpenDialog = (category?: Category) => {
    setError(null);
    setSuccessMessage(null);
    if (category) {
      setEditingCategory(category);
      setFormData({ 
        name: category.name || "", 
        description: category.description || "" 
      });
    } else {
      setEditingCategory(null);
      setFormData({ name: "", description: "" });
    }
    setIsDialogOpen(true);
  };

  // Handle save (create or update)
  const handleSave = async () => {
    if (!formData.name || !formData.name.trim()) {
      setError("Category name is required");
      return;
    }

    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const payload = {
        name: formData.name.trim(),
        description: (formData.description && formData.description.trim()) || undefined,
      };

      if (editingCategory) {
        // Update existing category
        const response = await apiClient.put(ENDPOINTS.categories.update(editingCategory.categoryId), payload);
        console.log("Update response:", response);
        setSuccessMessage("Category updated successfully!");
      } else {
        // Create new category
        const response = await apiClient.post(ENDPOINTS.categories.post(), payload);
        console.log("Create response:", response);
        setSuccessMessage("Category created successfully!");
      }

      // Refresh the list
      await fetchCategories();

      // Close dialog after a short delay to show success message
      setTimeout(() => {
        setIsDialogOpen(false);
        setEditingCategory(null);
        setFormData({ name: "", description: "" });
        setSuccessMessage(null);
      }, 1000);
    } catch (err: any) {
      console.error("Failed to save category:", err);
      // Try to extract more detailed error message
      const errorMessage = err.message || 
                          (err.response?.data?.message) ||
                          (editingCategory ? "Failed to update category" : "Failed to create category");
      setError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!deletingCategory) return;

    setIsSaving(true);
    setError(null);

    try {
      await apiClient.delete(ENDPOINTS.categories.delete(deletingCategory.categoryId));
      
      // Remove from local state
      setCategories(categories.filter((cat) => cat.categoryId !== deletingCategory.categoryId));
      
      // Close dialog
      setIsDeleteDialogOpen(false);
      setDeletingCategory(null);
      
      console.log("Category deleted successfully");
    } catch (err: any) {
      console.error("Failed to delete category:", err);
      setError(err.message || "Failed to delete category");
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

  return (
    <div className="space-y-6">
      {/* Main Card with all content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <CardTitle className="text-2xl">Categories</CardTitle>
              <CardDescription className="mt-1">
                Manage course categories and organize your content
              </CardDescription>
            </div>
            <Button onClick={() => handleOpenDialog()} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Category
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
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="text-sm text-muted-foreground">
              {filteredCategories.length} {filteredCategories.length === 1 ? "category" : "categories"} found
            </div>
          </div>

          {/* Error State */}
          {error && !isLoading && (
            <div className="flex items-center gap-2 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <div>
                <p className="font-medium">Failed to load categories</p>
                <p className="text-sm">{error}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchCategories}
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
              <span className="ml-2 text-muted-foreground">Loading categories...</span>
            </div>
          )}

          {/* Table Section */}
          {!isLoading && !error && filteredCategories.length > 0 && (
            <div className="rounded-md border">
              <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.map((category) => (
                  <TableRow key={category.categoryId}>
                    <TableCell>
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-(--brand-blue)/10 text-(--brand-blue)">
                        <FolderTree className="h-4 w-4" />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell className="text-muted-foreground max-w-md">
                      {category.description || <span className="text-muted-foreground/50">No description</span>}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {formatDate(category.createdAt)}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {formatDate(category.updatedAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDialog(category)}
                          className="h-8 w-8"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setDeletingCategory(category);
                            setIsDeleteDialogOpen(true);
                          }}
                          className="h-8 w-8 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && filteredCategories.length === 0 && (
            <div className="text-center py-12 border rounded-md">
              <p className="text-muted-foreground">
                {searchTerm ? "No categories found matching your search." : "No categories yet. Create your first category."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? "Edit Category" : "Create New Category"}
            </DialogTitle>
            <DialogDescription>
              {editingCategory
                ? "Update the category information below."
                : "Fill in the details to create a new category."}
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

            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  setError(null); // Clear error when user types
                }}
                placeholder="Enter category name"
                disabled={isSaving}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter category description"
                rows={4}
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
                  {editingCategory ? "Updating..." : "Creating..."}
                </>
              ) : (
                editingCategory ? "Update" : "Create"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{deletingCategory?.name}&quot;? This action cannot be undone.
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

