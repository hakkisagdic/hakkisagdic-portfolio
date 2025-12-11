"use client";

import { useEffect, useState } from "react";
import { Button, Input, Card, CardContent } from "@/components/ui";
import { Plus, Trash2, Save, Loader2, ChevronDown, ChevronUp, Award, ExternalLink } from "lucide-react";

interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expireDate: string | null;
  credentialId: string | null;
  url: string | null;
  order: number;
}

export default function CertificationsPage() {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/certifications")
      .then((r) => r.json())
      .then((data) => {
        const formatted = (Array.isArray(data) ? data : []).map((cert: Certification) => ({
          ...cert,
          issueDate: cert.issueDate?.split("T")[0] || "",
          expireDate: cert.expireDate?.split("T")[0] || "",
        }));
        setCertifications(formatted);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const addCertification = () => {
    const newCert: Certification = {
      id: `new-${Date.now()}`,
      name: "",
      issuer: "",
      issueDate: "",
      expireDate: null,
      credentialId: null,
      url: null,
      order: certifications.length,
    };
    setCertifications((prev) => [newCert, ...prev]);
    setExpandedId(newCert.id);
  };

  const updateCertification = (id: string, field: keyof Certification, value: string | null) => {
    setCertifications((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  const removeCertification = async (id: string) => {
    if (id.startsWith("new-")) {
      setCertifications((prev) => prev.filter((c) => c.id !== id));
      return;
    }

    try {
      await fetch(`/api/certifications?id=${id}`, { method: "DELETE" });
      setCertifications((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      console.error("Failed to delete:", error);
    }
  };

  const saveAll = async () => {
    setSaving(true);
    try {
      for (const cert of certifications) {
        const data = {
          ...cert,
          expireDate: cert.expireDate || null,
        };

        if (cert.id.startsWith("new-")) {
          const { id, ...rest } = data;
          const res = await fetch("/api/certifications", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(rest),
          });
          const newCert = await res.json();
          setCertifications((prev) =>
            prev.map((c) =>
              c.id === id
                ? {
                    ...newCert,
                    issueDate: newCert.issueDate?.split("T")[0],
                    expireDate: newCert.expireDate?.split("T")[0],
                  }
                : c
            )
          );
        } else {
          await fetch("/api/certifications", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });
        }
      }
    } catch (error) {
      console.error("Failed to save:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-heading text-white">Certifications</h1>
          <p className="text-gray-400 mt-1">Manage your professional certifications</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={addCertification} leftIcon={<Plus size={18} />}>
            Add Certification
          </Button>
          <Button onClick={saveAll} isLoading={saving} leftIcon={<Save size={18} />}>
            Save All
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {certifications.map((cert) => (
          <Card key={cert.id}>
            <CardContent className="p-0">
              {/* Header */}
              <div
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-surface-light transition-colors"
                onClick={() => setExpandedId(expandedId === cert.id ? null : cert.id)}
              >
                <div className="flex items-center gap-3">
                  <Award className="text-warning" size={20} />
                  <div>
                    <h3 className="font-heading text-white">{cert.name || "New Certification"}</h3>
                    <p className="text-sm text-gray-400">
                      {cert.issuer} {cert.issueDate && `• ${cert.issueDate}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {cert.url && <ExternalLink size={16} className="text-gray-400" />}
                  <button
                    onClick={(e) => { e.stopPropagation(); removeCertification(cert.id); }}
                    className="p-2 text-gray-400 hover:text-danger transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                  {expandedId === cert.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </div>

              {/* Expanded form */}
              {expandedId === cert.id && (
                <div className="p-4 pt-0 border-t border-primary/10 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Certification Name"
                      value={cert.name}
                      onChange={(e) => updateCertification(cert.id, "name", e.target.value)}
                      required
                      placeholder="AWS Solutions Architect"
                    />
                    <Input
                      label="Issuing Organization"
                      value={cert.issuer}
                      onChange={(e) => updateCertification(cert.id, "issuer", e.target.value)}
                      required
                      placeholder="Amazon Web Services"
                    />
                    <Input
                      label="Issue Date"
                      type="date"
                      value={cert.issueDate}
                      onChange={(e) => updateCertification(cert.id, "issueDate", e.target.value)}
                      required
                    />
                    <Input
                      label="Expiration Date (optional)"
                      type="date"
                      value={cert.expireDate || ""}
                      onChange={(e) => updateCertification(cert.id, "expireDate", e.target.value || null)}
                    />
                    <Input
                      label="Credential ID (optional)"
                      value={cert.credentialId || ""}
                      onChange={(e) => updateCertification(cert.id, "credentialId", e.target.value || null)}
                      placeholder="ABC123XYZ"
                    />
                    <Input
                      label="Credential URL (optional)"
                      value={cert.url || ""}
                      onChange={(e) => updateCertification(cert.id, "url", e.target.value || null)}
                      placeholder="https://www.credly.com/..."
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {certifications.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Award className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-400 mb-4">No certifications added yet</p>
            <Button onClick={addCertification} leftIcon={<Plus size={18} />}>
              Add Your First Certification
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
