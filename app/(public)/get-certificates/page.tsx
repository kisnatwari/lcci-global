"use client";

import { useState } from "react";
import Header from "@/components/website/Header";
import Footer from "@/components/website/Footer";
import PageHeader from "@/components/website/PageHeader";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Award, Loader2, Search, Check, ChevronDown } from "lucide-react";
import { apiClient, ENDPOINTS } from "@/lib/api";
import { cn } from "@/lib/utils";

export default function GetCertificatesPage() {
  const [formData, setFormData] = useState({
    name: "",
    trainingCentreId: "",
  });
  
  const [trainingCentres, setTrainingCentres] = useState<Array<{ centreId: string; name: string; centreUniqueIdentifier?: string | null }>>([]);
  const [isLoadingTrainingCentres, setIsLoadingTrainingCentres] = useState(false);
  const [trainingCentreSearchQuery, setTrainingCentreSearchQuery] = useState("");
  const [isTrainingCentrePopoverOpen, setIsTrainingCentrePopoverOpen] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch training centres when popover opens (lazy loading)
  const fetchTrainingCentres = async (search: string = "") => {
    if (trainingCentres.length > 0 && !search) return; // Don't refetch if already loaded and no search
    
    setIsLoadingTrainingCentres(true);
    try {
      const response = await apiClient.get(ENDPOINTS.trainingCentres.get());
      let fetchedCentres: any[] = [];
      
      if (response.success && response.data && Array.isArray(response.data.trainingCentres)) {
        fetchedCentres = response.data.trainingCentres;
      } else if (response.data && Array.isArray(response.data.trainingCentres)) {
        fetchedCentres = response.data.trainingCentres;
      } else if (response.trainingCentres && Array.isArray(response.trainingCentres)) {
        fetchedCentres = response.trainingCentres;
      } else if (Array.isArray(response)) {
        fetchedCentres = response;
      }

      const formattedCentres = fetchedCentres.map((centre: any) => ({
        centreId: centre.centreId,
        name: centre.name || "Unknown Centre",
        centreUniqueIdentifier: centre.centreUniqueIdentifier || null,
      }));

      setTrainingCentres(formattedCentres);
    } catch (err: any) {
      console.error("Failed to fetch training centres:", err);
    } finally {
      setIsLoadingTrainingCentres(false);
    }
  };

  // Filter training centres by search query
  const filteredTrainingCentres = trainingCentres.filter((centre) => {
    if (!trainingCentreSearchQuery) return true;
    const query = trainingCentreSearchQuery.toLowerCase();
    return (
      centre.name.toLowerCase().includes(query) ||
      centre.centreId.toLowerCase().includes(query) ||
      (centre.centreUniqueIdentifier && centre.centreUniqueIdentifier.toLowerCase().includes(query))
    );
  });

  // Get selected training centre display name
  const selectedTrainingCentre = trainingCentres.find((tc) => tc.centreId === formData.trainingCentreId);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.name || !formData.trainingCentreId) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Replace with actual API endpoint when backend is ready
      // This should return a file (PDF/image) that can be downloaded or displayed
      // Example: const response = await apiClient.get(`/api/certificates?name=${formData.name}&trainingCentreId=${formData.trainingCentreId}`, { responseType: 'blob' });
      
      // For now, simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // When backend is ready, handle file download:
      // const blob = new Blob([response.data], { type: 'application/pdf' });
      // const url = window.URL.createObjectURL(blob);
      // const link = document.createElement('a');
      // link.href = url;
      // link.download = `certificate-${formData.courseId}.pdf`;
      // document.body.appendChild(link);
      // link.click();
      // document.body.removeChild(link);
      // window.URL.revokeObjectURL(url);
      
      console.log("Fetching certificate for:", formData);
      setError("Backend not yet implemented. This will download the certificate file when ready.");
    } catch (err: any) {
      setError(err.message || "Certificate not found or failed to load. Please check your information and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <Header />

      <main className="flex-1">
        <PageHeader
          badge={{ icon: "🏆", text: "View Certificate" }}
          title="View Your"
          titleHighlight="Certificate"
          description="Enter your name and training centre to view and download your certificate."
        />

        <section className="py-20 bg-slate-50">
          <div className="container mx-auto px-4 lg:px-8 max-w-2xl">
            {/* Form */}
            <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-xl p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Student Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-bold text-slate-900 mb-2">
                    Student Name *
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-[color:var(--brand-blue)] focus:border-[color:var(--brand-blue)] text-sm transition-all hover:border-slate-300"
                    required
                  />
                </div>

                {/* Training Centre Selection */}
                <div>
                  <label htmlFor="trainingCentreId" className="block text-sm font-bold text-slate-900 mb-2">
                    Training Centre *
                  </label>
                  <Popover 
                    open={isTrainingCentrePopoverOpen} 
                    onOpenChange={(open) => {
                      setIsTrainingCentrePopoverOpen(open);
                      if (open) {
                        fetchTrainingCentres();
                      } else {
                        setTrainingCentreSearchQuery("");
                      }
                    }}
                  >
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        role="combobox"
                        id="trainingCentreId"
                        className={cn(
                          "w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm transition-all hover:border-slate-300 focus:ring-2 focus:ring-[color:var(--brand-blue)] focus:border-[color:var(--brand-blue)] outline-none text-left flex items-center justify-between",
                          !selectedTrainingCentre && "text-slate-500"
                        )}
                      >
                        <span className="truncate">
                          {selectedTrainingCentre 
                            ? `${selectedTrainingCentre.name}${selectedTrainingCentre.centreUniqueIdentifier ? ` (${selectedTrainingCentre.centreUniqueIdentifier})` : ''}` 
                            : "Select training centre..."}
                        </span>
                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[400px] p-0" align="start">
                      <div className="flex items-center border-b px-3 py-2">
                        <Search className="mr-2 h-4 w-4 shrink-0 text-slate-500" />
                        <Input
                          placeholder="Search training centres..."
                          value={trainingCentreSearchQuery}
                          onChange={(e) => setTrainingCentreSearchQuery(e.target.value)}
                          className="border-0 focus-visible:ring-0 h-8"
                          autoFocus
                        />
                      </div>
                      <div className="max-h-[300px] overflow-auto p-1">
                        {isLoadingTrainingCentres ? (
                          <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-4 w-4 animate-spin text-slate-500" />
                            <span className="ml-2 text-sm text-slate-600">Loading training centres...</span>
                          </div>
                        ) : filteredTrainingCentres.length === 0 ? (
                          <div className="py-6 text-center text-sm text-slate-600">
                            {trainingCentreSearchQuery ? "No training centres found." : "No training centres available."}
                          </div>
                        ) : (
                          <>
                            <div
                              className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-xs text-slate-500 outline-none hover:bg-slate-100 transition-colors"
                              onClick={() => {
                                handleChange("trainingCentreId", "");
                                setIsTrainingCentrePopoverOpen(false);
                                setTrainingCentreSearchQuery("");
                              }}
                            >
                              Clear selection
                            </div>
                            <div className="h-px bg-slate-200 my-1" />
                            {filteredTrainingCentres.map((centre) => (
                              <div
                                key={centre.centreId}
                                className={cn(
                                  "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-slate-100 transition-colors",
                                  formData.trainingCentreId === centre.centreId && "bg-blue-50 font-medium"
                                )}
                                onClick={() => {
                                  handleChange("trainingCentreId", centre.centreId);
                                  setIsTrainingCentrePopoverOpen(false);
                                  setTrainingCentreSearchQuery("");
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4 shrink-0",
                                    formData.trainingCentreId === centre.centreId ? "opacity-100 text-[color:var(--brand-blue)]" : "opacity-0"
                                  )}
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="truncate font-medium">{centre.name}</div>
                                  {centre.centreUniqueIdentifier && (
                                    <div className="truncate text-xs text-slate-500">{centre.centreUniqueIdentifier}</div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </>
                        )}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                {error && (
                  <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                    {error}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group w-full px-6 py-4 rounded-xl bg-[color:var(--brand-blue)] text-white text-sm font-bold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Loading...</span>
                    </>
                  ) : (
                    <>
                      <Award className="w-4 h-4" />
                      <span>View Certificate</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Info Note */}
            <div className="mt-8 p-4 rounded-lg bg-blue-50 border border-blue-200 text-sm text-slate-700">
              <p className="font-semibold mb-1">Note:</p>
              <p>
                Enter your name and select your training centre. All certificates matching your name will be displayed for download.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

