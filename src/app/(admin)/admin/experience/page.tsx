"use client";

import { useEffect, useState } from "react";
import { Button, Input, Textarea, Card, CardContent } from "@/components/ui";
import { Plus, Trash2, Save, Loader2, ChevronDown, ChevronUp } from "lucide-react";

interface Experience {
  id: string;
  title: string;
  company: string;
  location: string | null;
  startDate: string;
  endDate: string | null;
  current: boolean;
  description: string | null;
  order: number;
}

export default function ExperiencePage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/experience")
      .then((r) => r.json())
      .then((data) => {
        const formatted = (Array.isArray(data) ? data : []).map((exp: Experience) => ({
          ...exp,
          startDate: exp.startDate?.split("T")[0] || "",
          endDate: exp.endDate?.split("T")[0] || "",
        }));
        setExperiences(formatted);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const addExperience = () => {
    const newExp: Experience = {
      id: `new-${Date.now()}`,
      title: "",
      company: "",
      location: null,
      startDate: "",
      endDate: null,
      current: false,
      description: null,
      order: experiences.length,
    };
    setExperiences((prev) => [newExp, ...prev]);
    setExpandedId(newExp.id);
  };

  const updateExperience = (id: string, field: keyof Experience, value: string | boolean) => {
    setExperiences((prev) =>
      prev.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp))
    );
  };

  const removeExperience = async (id: string) => {
    if (id.startsWith("new-")) {
      setExperiences((prev) => prev.filter((exp) => exp.id !== id));
      return;
    }

    try {
      await fetch(`/api/experience?id=${id}`, { method: "DELETE" });
      setExperiences((prev) => prev.filter((exp) => exp.id !== id));
    } catch (error) {
      console.error("Failed to delete:", error);
    }
  };

  const saveAll = async () => {
    setSaving(true);
    try {
      for (const exp of experiences) {
        const data = {
          ...exp,
          endDate: exp.current ? null : exp.endDate || null,
        };

        if (exp.id.startsWith("new-")) {
          const { id, ...rest } = data;
          const res = await fetch("/api/experience", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(rest),
          });
          const newExp = await res.json();
          setExperiences((prev) => prev.map((e) => (e.id === id ? { ...newExp, startDate: newExp.startDate?.split("T")[0], endDate: newExp.endDate?.split("T")[0] } : e)));
        } else {
          await fetch("/api/experience", {
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
          <h1 className="text-3xl font-heading text-white">Experience</h1>
          <p className="text-gray-400 mt-1">Manage your work history</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={addExperience} leftIcon={<Plus size={18} />}>
            Add Experience
          </Button>
          <Button onClick={saveAll} isLoading={saving} leftIcon={<Save size={18} />}>
            Save All
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {experiences.map((exp) => (
          <Card key={exp.id}>
            <CardContent className="p-0">
              {/* Header - always visible */}
              <div
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-surface-light transition-colors"
                onClick={() => setExpandedId(expandedId === exp.id ? null : exp.id)}
              >
                <div>
                  <h3 className="font-heading text-white">
                    {exp.title || "New Experience"} {exp.company && `@ ${exp.company}`}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {exp.startDate} - {exp.current ? "Present" : exp.endDate || "Present"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); removeExperience(exp.id); }}
                    className="p-2 text-gray-400 hover:text-danger transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                  {expandedId === exp.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </div>

              {/* Expanded form */}
              {expandedId === exp.id && (
                <div className="p-4 pt-0 border-t border-primary/10 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Job Title" value={exp.title} onChange={(e) => updateExperience(exp.id, "title", e.target.value)} required />
                    <Input label="Company" value={exp.company} onChange={(e) => updateExperience(exp.id, "company", e.target.value)} required />
                    <Input label="Location" value={exp.location || ""} onChange={(e) => updateExperience(exp.id, "location", e.target.value)} />
                    <div className="flex items-end gap-4">
                      <Input label="Start Date" type="date" value={exp.startDate} onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)} required />
                    </div>
                    <Input label="End Date" type="date" value={exp.endDate || ""} onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)} disabled={exp.current} />
                    <div className="flex items-center gap-2 pt-8">
                      <input type="checkbox" id={`current-${exp.id}`} checked={exp.current} onChange={(e) => updateExperience(exp.id, "current", e.target.checked)} className="w-4 h-4" />
                      <label htmlFor={`current-${exp.id}`} className="text-gray-400">Currently working here</label>
                    </div>
                  </div>
                  <Textarea label="Description" value={exp.description || ""} onChange={(e) => updateExperience(exp.id, "description", e.target.value)} rows={4} />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {experiences.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-400 mb-4">No experience added yet</p>
            <Button onClick={addExperience} leftIcon={<Plus size={18} />}>Add Your First Experience</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
