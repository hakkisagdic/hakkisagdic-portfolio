"use client";

import { useState, useRef } from "react";
import { Button, Card, CardContent } from "@/components/ui";
import { Upload, FileText, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

export default function ImportPage() {
  const [files, setFiles] = useState<{
    profile: File | null;
    positions: File | null;
    education: File | null;
    skills: File | null;
  }>({
    profile: null,
    positions: null,
    education: null,
    skills: null,
  });
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    imported?: { profile: number; experience: number; education: number; skills: number };
    error?: string;
  } | null>(null);

  const fileInputRefs = {
    profile: useRef<HTMLInputElement>(null),
    positions: useRef<HTMLInputElement>(null),
    education: useRef<HTMLInputElement>(null),
    skills: useRef<HTMLInputElement>(null),
  };

  const handleFileSelect = (type: keyof typeof files, file: File | null) => {
    setFiles((prev) => ({ ...prev, [type]: file }));
    setResult(null);
  };

  const handleImport = async () => {
    const hasFiles = Object.values(files).some((f) => f !== null);
    if (!hasFiles) return;

    setImporting(true);
    setResult(null);

    try {
      const formData = new FormData();
      if (files.profile) formData.append("profile", files.profile);
      if (files.positions) formData.append("positions", files.positions);
      if (files.education) formData.append("education", files.education);
      if (files.skills) formData.append("skills", files.skills);

      const res = await fetch("/api/import/linkedin", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setResult(data);

      if (data.success) {
        setFiles({ profile: null, positions: null, education: null, skills: null });
      }
    } catch {
      setResult({ success: false, error: "Import failed" });
    } finally {
      setImporting(false);
    }
  };

  const fileTypes = [
    { key: "profile" as const, label: "Profile.csv", desc: "Basic profile information" },
    { key: "positions" as const, label: "Positions.csv", desc: "Work experience" },
    { key: "education" as const, label: "Education.csv", desc: "Education history" },
    { key: "skills" as const, label: "Skills.csv", desc: "Skills list" },
  ];

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-heading text-white">Import LinkedIn Data</h1>
        <p className="text-gray-400 mt-1">
          Upload your LinkedIn data export CSV files to populate your portfolio
        </p>
      </div>

      {/* Instructions */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <h2 className="font-heading text-lg text-primary mb-4">How to export from LinkedIn</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-400">
            <li>Go to LinkedIn → Settings → Data Privacy → Get a copy of your data</li>
            <li>Select &quot;Want something in particular?&quot; and choose the data you need</li>
            <li>Request archive and wait for email</li>
            <li>Download and extract the ZIP file</li>
            <li>Upload the CSV files below</li>
          </ol>
        </CardContent>
      </Card>

      {/* File Upload Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {fileTypes.map(({ key, label, desc }) => (
          <Card key={key}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-heading text-white">{label}</h3>
                  <p className="text-sm text-gray-400">{desc}</p>
                </div>
                {files[key] && <CheckCircle className="text-success" size={20} />}
              </div>

              <input
                ref={fileInputRefs[key]}
                type="file"
                accept=".csv"
                className="hidden"
                onChange={(e) => handleFileSelect(key, e.target.files?.[0] || null)}
              />

              <button
                type="button"
                onClick={() => fileInputRefs[key].current?.click()}
                className={`
                  w-full p-4 border-2 border-dashed rounded-lg transition-colors
                  flex flex-col items-center gap-2
                  ${files[key] 
                    ? "border-success/50 bg-success/5" 
                    : "border-primary/30 hover:border-primary/50 bg-surface"}
                `}
              >
                {files[key] ? (
                  <>
                    <FileText className="text-success" size={24} />
                    <span className="text-sm text-success">{files[key]?.name}</span>
                  </>
                ) : (
                  <>
                    <Upload className="text-gray-400" size={24} />
                    <span className="text-sm text-gray-400">Click to select file</span>
                  </>
                )}
              </button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Result Message */}
      {result && (
        <Card className={`mb-8 ${result.success ? "border-success/50" : "border-danger/50"}`}>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              {result.success ? (
                <CheckCircle className="text-success flex-shrink-0" size={24} />
              ) : (
                <AlertCircle className="text-danger flex-shrink-0" size={24} />
              )}
              <div>
                <h3 className={`font-heading ${result.success ? "text-success" : "text-danger"}`}>
                  {result.success ? "Import Successful!" : "Import Failed"}
                </h3>
                {result.imported && (
                  <ul className="mt-2 text-sm text-gray-400 space-y-1">
                    <li>Profile: {result.imported.profile > 0 ? "Updated" : "Not changed"}</li>
                    <li>Experience: {result.imported.experience} entries</li>
                    <li>Education: {result.imported.education} entries</li>
                    <li>Skills: {result.imported.skills} entries</li>
                  </ul>
                )}
                {result.error && <p className="mt-2 text-sm text-danger">{result.error}</p>}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Import Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleImport}
          disabled={!Object.values(files).some((f) => f !== null) || importing}
          isLoading={importing}
          leftIcon={importing ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18} />}
          size="lg"
        >
          {importing ? "Importing..." : "Import Data"}
        </Button>
      </div>
    </div>
  );
}
