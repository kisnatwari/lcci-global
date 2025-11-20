"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Award, Download, ExternalLink } from "lucide-react";

const certificates = [
  {
    id: "cert-1",
    title: "Executive Communication Lab",
    issuedAt: "2025-09-12T10:00:00.000Z",
    credentialId: "ECL-23918",
    url: "/certificates/ecl.pdf",
    status: "issued",
  },
  {
    id: "cert-2",
    title: "Customer Experience Excellence",
    issuedAt: "2025-07-02T10:00:00.000Z",
    credentialId: "CXE-11342",
    url: "/certificates/cxe.pdf",
    status: "issued",
  },
  {
    id: "cert-3",
    title: "Leadership Presence Accelerator",
    issuedAt: null,
    credentialId: null,
    url: null,
    status: "in_progress",
  },
];

export default function StudentCertificatesPage() {
  const formatDate = (date: string | null) =>
    date
      ? new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
      : "Pending";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Certificates</h1>
        <p className="mt-2 text-slate-600">
          Download and share your verified credentials. New certificates appear as soon as a course is
          completed.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {certificates.map((certificate) => (
          <Card key={certificate.id} className="border-slate-200 shadow-sm flex flex-col">
            <CardHeader className="flex flex-row items-center gap-3">
              <div className="rounded-2xl bg-gradient-to-br from-indigo-500 to-sky-500 p-3 text-white shadow-lg">
                <Award className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-lg">{certificate.title}</CardTitle>
                <CardDescription>{formatDate(certificate.issuedAt)}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Credential ID</span>
                <span className="font-mono text-slate-900">
                  {certificate.credentialId || "Pending issuance"}
                </span>
              </div>

              <Badge variant={certificate.status === "issued" ? "default" : "secondary"}>
                {certificate.status === "issued" ? "Issued" : "In progress"}
              </Badge>

              <div className="flex gap-2 pt-2">
                <Button
                  type="button"
                  variant="secondary"
                  className="flex-1"
                  disabled={!certificate.url}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  disabled={!certificate.url}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Verify
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

