"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Upload, FileJson, CheckCircle2, AlertCircle, XCircle, CheckCircle, AlertTriangle } from "lucide-react";
import { apiClient, ENDPOINTS } from "@/lib/api";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function BulkCertifyClient() {
  const [jsonInput, setJsonInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async () => {
    if (!jsonInput.trim()) {
      setError("Please provide JSON data");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(false);
    setResult(null);

    try {
      // Parse JSON to validate
      const parsed = JSON.parse(jsonInput);
      
      // Handle different JSON structures
      let payload: any;
      if (Array.isArray(parsed)) {
        payload = { students: parsed };
      } else if (parsed.students && Array.isArray(parsed.students)) {
        payload = parsed;
      } else {
        throw new Error("JSON must contain an array of students or a 'students' property with an array");
      }

      // Validate students structure
      if (!payload.students || payload.students.length === 0) {
        throw new Error("Students array cannot be empty");
      }

      const response = await apiClient.post(ENDPOINTS.certificates.bulkCertify(), payload);

      setResult(response);
      setSuccess(true);
      setJsonInput("");
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (err: any) {
      console.error("Bulk certify error:", err);
      if (err instanceof SyntaxError) {
        setError("Invalid JSON format: " + err.message);
      } else {
        setError(err.response?.data?.message || err.message || "Failed to bulk certify students. Please try again.");
      }
      setSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  const exampleJson = `{
  "students": [
    {
      "email": "test.student1@example.com",
      "firstName": "Test",
      "lastName": "Student1"
    },
    {
      "email": "test.student2@example.com",
      "firstName": "Test",
      "lastName": "Student2"
    }
  ]
}`;

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Bulk Certify Students</h1>
        <p className="mt-2 text-slate-600">
          Upload JSON data to bulk certify students
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>JSON Input</CardTitle>
          <CardDescription>
            Paste your JSON data in the format shown below
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="json-input">JSON Data</Label>
            <Textarea
              id="json-input"
              value={jsonInput}
              onChange={(e) => {
                setJsonInput(e.target.value);
                setError(null);
              }}
              placeholder={exampleJson}
              className="font-mono text-sm h-64 mt-2"
            />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={isLoading || !jsonInput.trim()}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload & Certify
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Error/Success Messages */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && result?.data && (
        <Alert className={
          result.data.failures?.length > 0
            ? "bg-amber-50 border-amber-200"
            : "bg-green-50 border-green-200"
        }>
          <CheckCircle2 className={`h-4 w-4 ${
            result.data.failures?.length > 0 ? "text-amber-600" : "text-green-600"
          }`} />
          <AlertTitle className={
            result.data.failures?.length > 0 ? "text-amber-800" : "text-green-800"
          }>
            {result.data.failures?.length > 0 ? "Partial Success" : "Success"}
          </AlertTitle>
          <AlertDescription className={
            result.data.failures?.length > 0 ? "text-amber-700" : "text-green-700"
          }>
            {result.message || "Bulk certification process completed."}
            {result.data.successes?.length > 0 && (
              <span className="block mt-1">
                {result.data.successes.length} student(s) certified successfully.
                {result.data.failures?.length > 0 && ` ${result.data.failures.length} student(s) failed.`}
              </span>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Result Display */}
      {result && success && result.data && (
        <div className="space-y-4">
          {/* Successes */}
          {result.data.successes && result.data.successes.length > 0 && (
            <Card className="border-green-200 bg-green-50/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <CheckCircle className="w-5 h-5" />
                  Successful Certifications ({result.data.successes.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {result.data.successes.map((success: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-white rounded-lg border border-green-200"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-slate-900">{success.name}</p>
                        {success.certificateUrl && (
                          <a
                            href={success.certificateUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-[color:var(--brand-blue)] hover:underline mt-1 block"
                          >
                            View Certificate
                          </a>
                        )}
                      </div>
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Failures */}
          {result.data.failures && result.data.failures.length > 0 && (
            <Card className="border-red-200 bg-red-50/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-800">
                  <XCircle className="w-5 h-5" />
                  Failed Certifications ({result.data.failures.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {result.data.failures.map((failure: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 bg-white rounded-lg border border-red-200"
                    >
                      <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="font-medium text-slate-900">{failure.email}</p>
                        <p className="text-sm text-red-700 mt-1">{failure.reason}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-2xl font-bold text-green-700">
                    {result.data.successes?.length || 0}
                  </p>
                  <p className="text-sm text-green-600 mt-1">Successful</p>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                  <p className="text-2xl font-bold text-red-700">
                    {result.data.failures?.length || 0}
                  </p>
                  <p className="text-sm text-red-600 mt-1">Failed</p>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <p className="text-2xl font-bold text-slate-700">
                    {(result.data.successes?.length || 0) + (result.data.failures?.length || 0)}
                  </p>
                  <p className="text-sm text-slate-600 mt-1">Total</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Raw Response (Collapsible) */}
          <details className="group">
            <summary className="cursor-pointer text-sm font-medium text-slate-600 hover:text-slate-900 p-2">
              View Raw Response
            </summary>
            <Card className="mt-2">
              <CardContent className="pt-4">
                <pre className="bg-slate-50 p-4 rounded-lg overflow-auto text-xs">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </CardContent>
            </Card>
          </details>
        </div>
      )}

      {/* Example JSON */}
      <Card className="bg-slate-50">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <FileJson className="w-4 h-4" />
            Example JSON Format
          </CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-xs font-mono bg-white p-4 rounded border overflow-auto">
            {exampleJson}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
