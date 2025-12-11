"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2, Search, HelpCircle, Loader2, AlertCircle, CheckCircle2, ArrowUp, ArrowDown } from "lucide-react";
import { apiClient, ENDPOINTS } from "@/lib/api";

type FAQ = {
  faqId: string;
  question: string;
  answer: string;
  isActive: boolean;
  orderIndex: number;
};

interface FAQsPageClientProps {
  initialFAQs: FAQ[];
  error: string | null;
}

export function FAQsPageClient({ initialFAQs, error: initialError }: FAQsPageClientProps) {
  const router = useRouter();
  const [faqs, setFaqsState] = useState<FAQ[]>(initialFAQs);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingFAQ, setDeletingFAQ] = useState<FAQ | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(initialError);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Refresh FAQs from API
  const refreshFAQs = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get(ENDPOINTS.faqs.get());
      
      let fetchedFAQs: FAQ[] = [];
      if (Array.isArray(response)) {
        fetchedFAQs = response;
      } else if (response.success && response.data && Array.isArray(response.data)) {
        fetchedFAQs = response.data;
      } else if (response.data && Array.isArray(response.data)) {
        fetchedFAQs = response.data;
      }
      
      setFaqsState(fetchedFAQs);
    } catch (err: any) {
      console.error("Failed to fetch FAQs:", err);
      setError(err.message || "Failed to load FAQs");
    } finally {
      setIsLoading(false);
    }
  };

  // Filter FAQs based on search
  const filteredFAQs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle delete
  const handleDelete = async () => {
    if (!deletingFAQ) return;

    setIsDeleting(true);
    setError(null);
    
    try {
      await apiClient.delete(ENDPOINTS.faqs.delete(deletingFAQ.faqId));
      
      // Remove from local state
      setFaqsState(faqs.filter((faq) => faq.faqId !== deletingFAQ.faqId));
      setIsDeleteDialogOpen(false);
      setDeletingFAQ(null);
      setSuccessMessage("FAQ deleted successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      console.error("Failed to delete FAQ:", err);
      setError(err.message || "Failed to delete FAQ");
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle order change
  const handleOrderChange = async (faq: FAQ, direction: "up" | "down") => {
    const currentIndex = faqs.findIndex((f) => f.faqId === faq.faqId);
    if (currentIndex === -1) return;

    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= faqs.length) return;

    const targetFAQ = faqs[newIndex];
    
    // Swap orderIndex values
    try {
      // Update both FAQs
      await Promise.all([
        apiClient.put(ENDPOINTS.faqs.update(faq.faqId), {
          question: faq.question,
          answer: faq.answer,
          isActive: faq.isActive,
          orderIndex: targetFAQ.orderIndex,
        }),
        apiClient.put(ENDPOINTS.faqs.update(targetFAQ.faqId), {
          question: targetFAQ.question,
          answer: targetFAQ.answer,
          isActive: targetFAQ.isActive,
          orderIndex: faq.orderIndex,
        }),
      ]);

      // Refresh from API
      await refreshFAQs();
      setSuccessMessage("FAQ order updated!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      console.error("Failed to update FAQ order:", err);
      setError(err.message || "Failed to update FAQ order");
    }
  };

  // Toggle active status
  const handleToggleActive = async (faq: FAQ) => {
    try {
      await apiClient.put(ENDPOINTS.faqs.update(faq.faqId), {
        question: faq.question,
        answer: faq.answer,
        isActive: !faq.isActive,
        orderIndex: faq.orderIndex,
      });

      // Update local state
      setFaqsState(faqs.map((f) => 
        f.faqId === faq.faqId ? { ...f, isActive: !f.isActive } : f
      ));
      
      setSuccessMessage(`FAQ ${faq.isActive ? "deactivated" : "activated"}!`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      console.error("Failed to toggle FAQ status:", err);
      setError(err.message || "Failed to update FAQ status");
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Card with all content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <CardTitle className="text-2xl">FAQs</CardTitle>
              <CardDescription className="mt-1">
                Manage frequently asked questions displayed on the homepage
              </CardDescription>
            </div>
            <Button onClick={() => router.push("/admin/faqs/new")} className="gap-2">
              <Plus className="h-4 w-4" />
              New FAQ
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
                placeholder="Search FAQs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="text-sm text-muted-foreground">
              {filteredFAQs.length} {filteredFAQs.length === 1 ? "FAQ" : "FAQs"} found
            </div>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="flex items-center gap-2 p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <p>{successMessage}</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="flex items-center gap-2 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p>{error}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={refreshFAQs}
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
              <span className="ml-2 text-muted-foreground">Loading FAQs...</span>
            </div>
          )}

          {/* Table Section */}
          {!isLoading && filteredFAQs.length > 0 && (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Question</TableHead>
                    <TableHead>Answer</TableHead>
                    <TableHead className="w-24">Order</TableHead>
                    <TableHead className="w-24">Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFAQs.map((faq, index) => (
                    <TableRow key={faq.faqId || `faq-${index}`}>
                      <TableCell>
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[color:var(--brand-blue)]/10 text-[color:var(--brand-blue)]">
                          <HelpCircle className="h-4 w-4" />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium max-w-md">
                        <div className="line-clamp-2">{faq.question}</div>
                      </TableCell>
                      <TableCell className="text-muted-foreground max-w-md">
                        <div className="line-clamp-2 text-sm">{faq.answer}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleOrderChange(faq, "up")}
                            disabled={index === 0}
                            title="Move up"
                          >
                            <ArrowUp className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleOrderChange(faq, "down")}
                            disabled={index === filteredFAQs.length - 1}
                            title="Move down"
                          >
                            <ArrowDown className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={faq.isActive}
                            onCheckedChange={() => handleToggleActive(faq)}
                          />
                          <span className="text-xs text-muted-foreground">
                            {faq.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.push(`/admin/faqs/${faq.faqId}/edit`)}
                            className="h-8 w-8"
                            title="Edit FAQ"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setDeletingFAQ(faq);
                              setIsDeleteDialogOpen(true);
                            }}
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            title="Delete FAQ"
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
          {!isLoading && filteredFAQs.length === 0 && (
            <div className="text-center py-12">
              <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {searchTerm ? "No FAQs found" : "No FAQs yet"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm
                  ? "Try adjusting your search terms"
                  : "Get started by creating your first FAQ"}
              </p>
              {!searchTerm && (
                <Button onClick={() => router.push("/admin/faqs/new")} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create FAQ
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete FAQ</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this FAQ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="font-medium mb-2">Question:</p>
            <p className="text-sm text-muted-foreground">{deletingFAQ?.question}</p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setDeletingFAQ(null);
              }}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
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

