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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Pencil, Trash2, Search, Tag, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { createPromoCode, updatePromoCode, deletePromoCode, getPromoCodes, type PromoCode, type DiscountType } from "@/lib/api/promo-codes";

type PromoCodeType = {
  promoId: string;
  code: string;
  description: string;
  discountType: "percentage" | "fixed";
  value: number | string;
  maxUses: number;
  usedCount?: number;
  expiresAt: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
};

interface PromoCodesPageClientProps {
  initialPromoCodes: PromoCodeType[];
  error: string | null;
}

export function PromoCodesPageClient({ initialPromoCodes, error: initialError }: PromoCodesPageClientProps) {
  const [promoCodes, setPromoCodes] = useState<PromoCodeType[]>(initialPromoCodes);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingPromoCode, setEditingPromoCode] = useState<PromoCodeType | null>(null);
  const [deletingPromoCode, setDeletingPromoCode] = useState<PromoCodeType | null>(null);
  const [formData, setFormData] = useState({
    code: "",
    description: "",
    discountType: "percentage" as DiscountType,
    value: 0,
    maxUses: 100,
    expiresAt: "",
    isActive: true,
  });
  
  // Loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(initialError);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch promo codes from API (for refresh)
  const fetchPromoCodes = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const codes = await getPromoCodes();
      // Ensure all values are normalized (convert string values to numbers, ensure promoId exists)
      const normalizedCodes = codes.map((code: any) => ({
        ...code,
        promoId: code.promoId || code.id, // Handle both promoId and id
        value: typeof code.value === 'string' ? parseFloat(code.value) : (code.value || 0),
        maxUses: code.maxUses || 0,
        usedCount: code.usedCount || 0,
        isActive: code.isActive !== undefined ? code.isActive : true,
      }));
      setPromoCodes(normalizedCodes);
    } catch (err: any) {
      console.error("Failed to fetch promo codes:", err);
      setError(err.message || "Failed to load promo codes");
      setPromoCodes([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter promo codes based on search
  const filteredPromoCodes = promoCodes.filter(
    (promoCode) =>
      promoCode.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle create/edit dialog open
  const handleOpenDialog = (promoCode?: PromoCodeType) => {
    setError(null);
    setSuccessMessage(null);
    if (promoCode) {
      setEditingPromoCode(promoCode);
      // Format expiry date for input (YYYY-MM-DDTHH:mm)
      const expiresAt = new Date(promoCode.expiresAt);
      const formattedDate = expiresAt.toISOString().slice(0, 16);
      setFormData({
        code: promoCode.code,
        description: promoCode.description || "",
        discountType: promoCode.discountType,
        value: typeof promoCode.value === 'string' ? parseFloat(promoCode.value) : promoCode.value,
        maxUses: promoCode.maxUses,
        expiresAt: formattedDate,
        isActive: promoCode.isActive ?? true,
      });
    } else {
      setEditingPromoCode(null);
      // Set default expiry to 1 year from now
      const defaultDate = new Date();
      defaultDate.setFullYear(defaultDate.getFullYear() + 1);
      const formattedDate = defaultDate.toISOString().slice(0, 16);
      setFormData({
        code: "",
        description: "",
        discountType: "percentage",
        value: 0,
        maxUses: 100,
        expiresAt: formattedDate,
        isActive: true,
      });
    }
    setIsDialogOpen(true);
  };

  // Handle save (create or update)
  const handleSave = async () => {
    if (!formData.code || !formData.code.trim()) {
      setError("Promo code is required");
      return;
    }
    if (formData.value <= 0) {
      setError("Discount value must be greater than 0");
      return;
    }
    if (formData.maxUses <= 0) {
      setError("Max uses must be greater than 0");
      return;
    }
    if (!formData.expiresAt) {
      setError("Expiry date is required");
      return;
    }

    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // Convert expiry date to ISO string
      const expiresAtISO = new Date(formData.expiresAt).toISOString();

      if (editingPromoCode) {
        // Update existing promo code
        await updatePromoCode(editingPromoCode.promoId, {
          description: formData.description.trim() || undefined,
          value: formData.value,
          maxUses: formData.maxUses,
          expiresAt: expiresAtISO,
          isActive: formData.isActive,
        });
        setSuccessMessage("Promo code updated successfully!");
      } else {
        // Create new promo code
        await createPromoCode({
          code: formData.code.trim().toUpperCase(),
          description: formData.description.trim(),
          discountType: formData.discountType,
          value: formData.value,
          maxUses: formData.maxUses,
          expiresAt: expiresAtISO,
          isActive: formData.isActive,
        });
        setSuccessMessage("Promo code created successfully!");
      }

      // Refresh the list
      await fetchPromoCodes();

      // Close dialog after a short delay to show success message
      setTimeout(() => {
        setIsDialogOpen(false);
        setEditingPromoCode(null);
        setSuccessMessage(null);
      }, 1000);
    } catch (err: any) {
      console.error("Failed to save promo code:", err);
      const errorMessage = err.message || 
                          (err.response?.data?.message) ||
                          (editingPromoCode ? "Failed to update promo code" : "Failed to create promo code");
      setError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!deletingPromoCode) return;

    setIsSaving(true);
    setError(null);

    try {
      await deletePromoCode(deletingPromoCode.promoId);
      
      // Remove from local state
      setPromoCodes(promoCodes.filter((code) => code.promoId !== deletingPromoCode.promoId));
      
      // Close dialog
      setIsDeleteDialogOpen(false);
      setDeletingPromoCode(null);
      setError(null);
      setSuccessMessage("Promo code deleted successfully!");
      
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      console.error("Failed to delete promo code:", err);
      setError(err.message || "Failed to delete promo code");
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
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Check if promo code is expired
  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date();
  };

  // Format discount display
  const formatDiscount = (type: DiscountType, value: number | string) => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (type === "percentage") {
      return `${numValue}%`;
    }
    return `NPR ${numValue.toLocaleString()}`;
  };

  return (
    <div className="space-y-6">
      {/* Success Message Banner */}
      {successMessage && (
        <div className="flex items-center gap-2 p-4 rounded-lg bg-green-50 border border-green-200 text-green-700">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span className="font-medium">{successMessage}</span>
        </div>
      )}

      {/* Main Card with all content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <CardTitle className="text-2xl">Promo Codes</CardTitle>
              <CardDescription className="mt-1">
                Manage discount codes and promotional offers
              </CardDescription>
            </div>
            <Button onClick={() => handleOpenDialog()} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Promo Code
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
                placeholder="Search promo codes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="text-sm text-muted-foreground">
              {filteredPromoCodes.length} {filteredPromoCodes.length === 1 ? "code" : "codes"} found
            </div>
          </div>

          {/* Error State */}
          {error && !isLoading && (
            <div className="flex items-center gap-2 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <div>
                <p className="font-medium">Failed to load promo codes</p>
                <p className="text-sm">{error}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchPromoCodes}
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
              <span className="ml-2 text-muted-foreground">Loading promo codes...</span>
            </div>
          )}

          {/* Table Section */}
          {!isLoading && !error && filteredPromoCodes.length > 0 && (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Discount</TableHead>
                    <TableHead>Max Uses</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPromoCodes.map((promoCode) => (
                    <TableRow key={promoCode.promoId}>
                      <TableCell>
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[color:var(--brand-blue)]/10 text-[color:var(--brand-blue)]">
                          <Tag className="h-4 w-4" />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium font-mono">{promoCode.code}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {formatDiscount(promoCode.discountType, promoCode.value)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {promoCode.maxUses}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {formatDate(promoCode.expiresAt)}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          {isExpired(promoCode.expiresAt) ? (
                            <Badge variant="destructive">Expired</Badge>
                          ) : promoCode.isActive ? (
                            <Badge variant="default">Active</Badge>
                          ) : (
                            <Badge variant="secondary">Inactive</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenDialog(promoCode)}
                            className="h-8 w-8"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setDeletingPromoCode(promoCode);
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
          {!isLoading && !error && filteredPromoCodes.length === 0 && (
            <div className="text-center py-12 border rounded-md">
              <p className="text-muted-foreground">
                {searchTerm ? "No promo codes found matching your search." : "No promo codes yet. Create your first promo code."}
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
              {editingPromoCode ? "Edit Promo Code" : "Create New Promo Code"}
            </DialogTitle>
            <DialogDescription>
              {editingPromoCode
                ? "Update the promo code information below. Note: Code and discount type cannot be changed."
                : "Fill in the details to create a new promo code."}
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
              <Label htmlFor="code">Promo Code *</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => {
                  setFormData({ ...formData, code: e.target.value.toUpperCase() });
                  setError(null);
                }}
                placeholder="WELCOME2025"
                disabled={isSaving || !!editingPromoCode}
                className="font-mono"
              />
              {editingPromoCode && (
                <p className="text-xs text-muted-foreground">Code cannot be changed after creation</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => {
                  setFormData({ ...formData, description: e.target.value });
                  setError(null);
                }}
                placeholder="Enter promo code description"
                disabled={isSaving}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="discountType">Discount Type *</Label>
                <Select
                  value={formData.discountType}
                  onValueChange={(value: DiscountType) => {
                    setFormData({ ...formData, discountType: value });
                    setError(null);
                  }}
                  disabled={isSaving || !!editingPromoCode}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                    <SelectItem value="fixed">Fixed Amount (NPR)</SelectItem>
                  </SelectContent>
                </Select>
                {editingPromoCode && (
                  <p className="text-xs text-muted-foreground">Type cannot be changed after creation</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="value">
                  Discount Value * ({formData.discountType === "percentage" ? "%" : "NPR"})
                </Label>
                <Input
                  id="value"
                  type="number"
                  min="0"
                  step={formData.discountType === "percentage" ? "1" : "0.01"}
                  value={formData.value}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value) || 0;
                    setFormData({ ...formData, value: value });
                    setError(null);
                  }}
                  placeholder={formData.discountType === "percentage" ? "20" : "500"}
                  disabled={isSaving}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="maxUses">Max Uses *</Label>
                <Input
                  id="maxUses"
                  type="number"
                  min="1"
                  value={formData.maxUses}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 0;
                    setFormData({ ...formData, maxUses: value });
                    setError(null);
                  }}
                  placeholder="100"
                  disabled={isSaving}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiresAt">Expiry Date *</Label>
                <Input
                  id="expiresAt"
                  type="datetime-local"
                  value={formData.expiresAt}
                  onChange={(e) => {
                    setFormData({ ...formData, expiresAt: e.target.value });
                    setError(null);
                  }}
                  disabled={isSaving}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => {
                  setFormData({ ...formData, isActive: checked === true });
                  setError(null);
                }}
                disabled={isSaving}
              />
              <Label
                htmlFor="isActive"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Active
              </Label>
              <p className="text-xs text-muted-foreground">
                Only active promo codes can be used for enrollment
              </p>
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
              disabled={
                !formData.code.trim() || 
                !formData.description.trim() ||
                formData.value <= 0 || 
                formData.maxUses <= 0 || 
                !formData.expiresAt || 
                isSaving
              }
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {editingPromoCode ? "Updating..." : "Creating..."}
                </>
              ) : (
                editingPromoCode ? "Update" : "Create"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Promo Code</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{deletingPromoCode?.code}&quot;? This action cannot be undone.
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

