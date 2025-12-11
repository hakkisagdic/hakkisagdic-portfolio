"use client";

import { useEffect, useState } from "react";
import { Button, Input, Textarea, Card, CardContent } from "@/components/ui";
import { Plus, Trash2, Save, Loader2, ChevronDown, ChevronUp } from "lucide-react";

interface Education {
  id: string;
  school: string;
  degree: string;
  field: string | null;
  startDate: string;
  endDate: string | null;
  description: string | null;
  order: number;
}

export default function EducationPage() {
  const [education, setEducation] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/education")
      .then((r) => r.json())
      .then((data) => {
        const formatted = (Array.isArray(data) ? data : []).map((edu: Education) => ({
          ...edu,
          startDate: edu.startDate?.split("T")[0] || "",
          endDate: edu.endDate?.split("T")[0] || "",
        }));
        setEducation(formatted);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const addEducation = () => {
    const newEdu: Education = {
      id: `new-${Date.now()}`,
      school: "",
      degree: "",
      field: null,
      startDate: "",
      endDate: null,
      description: null,
      order: education.length,
    };
    setEducation((prev) => [newEdu, ...prev]);
    setExpandedId(newEdu.id);
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    setEducation((prev) =>
      prev.map((edu) => (edu.id === id ? { ...edu, [field]: value } : edu))
    );
  };

  const removeEducation = async (id: string) => {
    if (id.startsWith("new-")) {
      setEducation((prev) => prev.filter((edu) => edu.id !== id));
      return;
    }

    try {
      await fetch(`/api/education?id=${id}`, { method: "DELETE" });
      setEducation((prev) => prev.filter((edu) => edu.id !== id));
    } catch (error) {
      console.error("Failed to delete:", error);
    }
  };

  const saveAll = async () => {
    setSaving(true);
    try {
      for (const edu of education) {
        if (edu.id.startsWith("new-")) {
          const { id, ...data } = edu;
          const res = await fetch("/api/education", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });
          const newEdu = await res.json();
          setEducation((prev) => prev.map((e) => (e.id === id ? { ...newEdu, startDate: newEdu.startDate?.split("T")[0], endDate: newEdu.endDate?.split("T")[0] } : e)));
        } else {
          await fetch("/api/education", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(edu),
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
          <h1 className="text-3xl font-heading text-white">Education</h1>
          <p className="text-gray-400 mt-1">Manage your education history</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={addEducation} leftIcon={<Plus size={18} />}>
            Add Education
          </Button>
          <Button onClick={saveAll} isLoading={saving} leftIcon={<Save size={18} />}>
            Save All
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {education.map((edu) => (
          <Card key={edu.id}>
            <CardContent className="p-0">
              <div
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-surface-light transition-colors"
                onClick={() => setExpandedId(expandedId === edu.id ? null : edu.id)}
              >
                <div>
                  <h3 className="font-heading text-white">{edu.degree || "New Education"} {edu.field && `in ${edu.field}`}</h3>
                  <p className="text-sm text-gray-400">{edu.school} • {edu.startDate} - {edu.endDate || "Present"}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={(e) => { e.stopPropagation(); removeEducation(edu.id); }} className="p-2 text-gray-400 hover:text-danger transition-colors">
                    <Trash2 size={18} />
                  </button>
                  {expandedId === edu.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </div>

              {expandedId === edu.id && (
                <div className="p-4 pt-0 border-t border-primary/10 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="School / University" value={edu.school} onChange={(e) => updateEducation(edu.id, "school", e.target.value)} required />
                    <Input label="Degree" value={edu.degree} onChange={(e) => updateEducation(edu.id, "degree", e.target.value)} required placeholder="Bachelor's, Master's, etc." />
                    <Input label="Field of Study" value={edu.field || ""} onChange={(e) => updateEducation(edu.id, "field", e.target.value)} placeholder="Computer Science" />
                    <div />
                    <Input label="Start Date" type="date" value={edu.startDate} onChange={(e) => updateEducation(edu.id, "startDate", e.target.value)} required />
                    <Input label="End Date" type="date" value={edu.endDate || ""} onChange={(e) => updateEducation(edu.id, "endDate", e.target.value)} />
                  </div>
                  <Textarea label="Description / Notes" value={edu.description || ""} onChange={(e) => updateEducation(edu.id, "description", e.target.value)} rows={3} />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {education.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-400 mb-4">No education added yet</p>
            <Button onClick={addEducation} leftIcon={<Plus size={18} />}>Add Your First Education</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
