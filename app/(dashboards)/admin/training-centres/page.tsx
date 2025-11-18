"use client";

import { useState } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, Search, MoreVertical, Eye, Copy, Pencil, Trash2, Building2 } from "lucide-react";

// Static data matching the API schema
const initialTrainingCentres = [
  {
    centreId: "centre-1",
    name: "LCCI Glasgow Training Centre",
    description: "Main training facility in Glasgow offering SQA and Cambridge programs",
    category: "SQA" as const,
    autoEnroll: true,
    createdAt: "2025-11-18T11:16:24.942Z",
  },
  {
    centreId: "centre-2",
    name: "LCCI Edinburgh Centre",
    description: "Edinburgh-based training centre specializing in Cambridge qualifications",
    category: "Cambridge" as const,
    autoEnroll: false,
    createdAt: "2025-11-17T10:15:20.942Z",
  },
  {
    centreId: "centre-3",
    name: "LCCI Aberdeen Training Hub",
    description: "Comprehensive training hub offering both SQA and Cambridge programs",
    category: "SQA" as const,
    autoEnroll: true,
    createdAt: "2025-11-16T09:14:15.942Z",
  },
];

type TrainingCentreCategory = "SQA" | "Cambridge";

type TrainingCentre = {
  centreId: string;
  name: string;
  description: string;
  category: TrainingCentreCategory;
  autoEnroll: boolean;
  createdAt: string;
};

export default function TrainingCentresPage() {
  const [centres, setCentres] = useState<TrainingCentre[]>(initialTrainingCentres);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingCentre, setEditingCentre] = useState<TrainingCentre | null>(null);
  const [deletingCentre, setDeletingCentre] = useState<TrainingCentre | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "SQA" as TrainingCentreCategory,
    autoEnroll: false,
  });

  // Filter centres based on search
  const filteredCentres = centres.filter(
    (centre) =>
      centre.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      centre.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      centre.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle create/edit dialog open
  const handleOpenDialog = (centre?: TrainingCentre) => {
    if (centre) {
      setEditingCentre(centre);
      setFormData({
        name: centre.name,
        description: centre.description,
        category: centre.category,
        autoEnroll: centre.autoEnroll,
      });
    } else {
      setEditingCentre(null);
      setFormData({
        name: "",
        description: "",
        category: "SQA",
        autoEnroll: false,
      });
    }
    setIsDialogOpen(true);
  };

  // Handle save (create or update)
  const handleSave = () => {
    if (!formData.name.trim()) return;

    if (editingCentre) {
      // Update existing centre
      setCentres(
        centres.map((centre) =>
          centre.centreId === editingCentre.centreId
            ? {
                ...centre,
                name: formData.name,
                description: formData.description,
                category: formData.category,
                autoEnroll: formData.autoEnroll,
              }
            : centre
        )
      );
    } else {
      // Create new centre
      const newCentre: TrainingCentre = {
        centreId: `centre-${Date.now()}`,
        name: formData.name,
        description: formData.description,
        category: formData.category,
        autoEnroll: formData.autoEnroll,
        createdAt: new Date().toISOString(),
      };
      setCentres([...centres, newCentre]);
    }

    setIsDialogOpen(false);
    setEditingCentre(null);
    setFormData({
      name: "",
      description: "",
      category: "SQA",
      autoEnroll: false,
    });
  };

  // Handle delete
  const handleDelete = () => {
    if (deletingCentre) {
      setCentres(centres.filter((centre) => centre.centreId !== deletingCentre.centreId));
      setIsDeleteDialogOpen(false);
      setDeletingCentre(null);
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
              {filteredCentres.length} {filteredCentres.length === 1 ? "centre" : "centres"} found
            </div>
          </div>

          {/* Table Section */}
          {filteredCentres.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Auto Enroll</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCentres.map((centre) => (
                    <TableRow key={centre.centreId}>
                      <TableCell>
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-(--brand-blue)/10 text-(--brand-blue)">
                          <Building2 className="h-4 w-4" />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{centre.name}</TableCell>
                      <TableCell className="text-muted-foreground max-w-md">
                        {centre.description}
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-muted">
                          {centre.category}
                        </span>
                      </TableCell>
                      <TableCell>
                        {centre.autoEnroll ? (
                          <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                            Enabled
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-muted text-muted-foreground">
                            Disabled
                          </span>
                        )}
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
                            <DropdownMenuItem
                              onClick={() => {
                                // View action - can be implemented later
                                console.log("View centre:", centre.centreId);
                              }}
                              className="cursor-pointer"
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                // Duplicate action - can be implemented later
                                console.log("Duplicate centre:", centre.centreId);
                              }}
                              className="cursor-pointer"
                            >
                              <Copy className="mr-2 h-4 w-4" />
                              Duplicate
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
          ) : (
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
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter training centre name"
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
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value: TrainingCentreCategory) =>
                    setFormData({ ...formData, category: value })
                  }
                >
                  <SelectTrigger id="category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SQA">SQA</SelectItem>
                    <SelectItem value="Cambridge">Cambridge</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end space-x-2 pb-0.5">
                <Checkbox
                  id="autoEnroll"
                  checked={formData.autoEnroll}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, autoEnroll: checked === true })
                  }
                />
                <Label
                  htmlFor="autoEnroll"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  Auto Enroll Students
                </Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!formData.name.trim()}>
              {editingCentre ? "Update" : "Create"}
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
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

