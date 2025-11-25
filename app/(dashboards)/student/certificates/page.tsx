"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Award, Download, ExternalLink, Loader2, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { getUserCertificates, type Certificate } from "@/lib/api/certificates";
import { apiClient, ENDPOINTS } from "@/lib/api";

export default function StudentCertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    fetchUserProfileAndCertificates();
  }, []);

  const fetchUserProfileAndCertificates = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // First, get the user profile to get userId
      const profileResponse = await apiClient.get(ENDPOINTS.profile.me());
      const profileData = profileResponse.success && profileResponse.data ? profileResponse.data : profileResponse.data || profileResponse;
      const userUserId = profileData.userId;

      if (!userUserId) {
        throw new Error("User ID not found");
      }

      setUserId(userUserId);

      // Then fetch certificates for this user
      const certs = await getUserCertificates(userUserId);
      setCertificates(certs);
    } catch (err: any) {
      console.error("Failed to fetch certificates:", err);
      setError(err.message || "Failed to load certificates");
      setCertificates([]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleDownload = (certificateUrl: string) => {
    window.open(certificateUrl, "_blank");
  };

  const handleVerify = (certificateUrl: string) => {
    window.open(certificateUrl, "_blank");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-[color:var(--brand-blue)]" />
          <p className="text-slate-600">Loading certificates...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-8">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <div>
              <h3 className="font-semibold text-red-900">Error loading certificates</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
              <Button onClick={fetchUserProfileAndCertificates} className="mt-4" variant="outline">
                Try Again
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Certificates</h1>
        <p className="mt-2 text-slate-600">
          Download and share your verified credentials. New certificates appear as soon as a course is
          completed.
        </p>
      </div>

      {certificates.length === 0 ? (
        <Card className="border-slate-200">
          <CardContent className="p-12 text-center">
            <Award className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No certificates yet</h3>
            <p className="text-slate-600 mb-6">
              Complete courses to earn certificates. Your certificates will appear here once issued.
            </p>
            <Button asChild className="bg-[color:var(--brand-blue)] hover:bg-[color:var(--brand-blue)]/90 text-white">
              <a href="/courses">Browse Courses</a>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {certificates.map((certificate) => (
            <Card key={certificate.certificateId} className="border-slate-200 shadow-sm flex flex-col">
              <CardHeader className="flex flex-row items-center gap-3">
                <div className="rounded-2xl bg-[color:var(--brand-blue)] p-3 text-white shadow-lg">
                  <Award className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg">Certificate</CardTitle>
                  <CardDescription>{formatDate(certificate.issuedAt)}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="flex-1 space-y-4">
                <div className="flex items-center justify-between text-sm text-slate-600">
                  <span>Certificate ID</span>
                  <span className="font-mono text-slate-900">
                    {certificate.certificateId}
                  </span>
                </div>

                <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
                  Issued
                </Badge>

                <div className="flex gap-2 pt-2">
                  <Button
                    type="button"
                    variant="secondary"
                    className="flex-1"
                    onClick={() => handleDownload(certificate.certificateUrl)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleVerify(certificate.certificateUrl)}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
