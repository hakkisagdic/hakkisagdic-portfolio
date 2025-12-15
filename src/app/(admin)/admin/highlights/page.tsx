"use client";

import { useEffect, useState } from "react";
import { Button, Input, Textarea, Card, CardContent } from "@/components/ui";
import { Plus, Trash2, Save, Loader2, ChevronDown, ChevronUp } from "lucide-react";

interface Highlight {
  id: string;
  icon: string;
  title: string;
  description: string;
  order: number;
}

const availableIcons = [
  "Container",
  "Cloud",
  "GitBranch",
  "Database",
  "Terminal",
  "Shield",
  "Server",
  "Globe",
  "Code",
  "Cpu",
  "HardDrive",
  "Lock",
  "Layers",
  "Network",
  "Wifi",
  "Zap",
  "Settings",
  "Rocket",
  "Award",
  "CheckCircle",
];

export default function HighlightsPage() {
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/highlights")
      .then((r) => r.json())
      .then((data) => {
        setHighlights(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const addHighlight = () => {
    const newHighlight: Highlight = {
      id: `new-${Date.now()}`,
      icon: "Container",
      title: "",
      description: "",
      order: highlights.length,
    };
    setHighlights((prev) => [...prev, newHighlight]);
    setExpandedId(newHighlight.id);
  };

  const updateHighlight = (id: string, field: keyof Highlight, value: string | number) => {
    setHighlights((prev) =>
      prev.map((h) => (h.id === id ? { ...h, [field]: value } : h))
    );
  };

  const removeHighlight = async (id: string) => {
    if (id.startsWith("new-")) {
      setHighlights((prev) => prev.filter((h) => h.id !== id));
      return;
    }

    try {
      await fetch(`/api/highlights?id=${id}`, { method: "DELETE" });
      setHighlights((prev) => prev.filter((h) => h.id !== id));
    } catch (error) {
      console.error("Failed to delete highlight:", error);
    }
  };

  const moveHighlight = (id: string, direction: "up" | "down") => {
    const index = highlights.findIndex((h) => h.id === id);
    if (index === -1) return;
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === highlights.length - 1) return;

    const newHighlights = [...highlights];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    [newHighlights[index], newHighlights[targetIndex]] = [newHighlights[targetIndex], newHighlights[index]];

    // Update order values
    newHighlights.forEach((h, i) => {
      h.order = i;
    });

    setHighlights(newHighlights);
  };

  const saveAll = async () => {
    setSaving(true);
    try {
      for (const highlight of highlights) {
        if (highlight.id.startsWith("new-")) {
          const { id, ...data } = highlight;
          const res = await fetch("/api/highlights", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });
          const newHighlight = await res.json();
          setHighlights((prev) =>
            prev.map((h) => (h.id === id ? newHighlight : h))
          );
        } else {
          await fetch("/api/highlights", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(highlight),
          });
        }
      }
    } catch (error) {
      console.error("Failed to save highlights:", error);
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
          <h1 className="text-3xl font-heading text-white">Highlights</h1>
          <p className="text-gray-400 mt-1">Manage your About section highlights</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={addHighlight} leftIcon={<Plus size={18} />}>
            Add Highlight
          </Button>
          <Button onClick={saveAll} isLoading={saving} leftIcon={<Save size={18} />}>
            Save All
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {highlights.map((highlight, index) => (
          <Card key={highlight.id}>
            <CardContent className="p-0">
              <div
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-surface-light transition-colors"
                onClick={() => setExpandedId(expandedId === highlight.id ? null : highlight.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); moveHighlight(highlight.id, "up"); }}
                      disabled={index === 0}
                      className="p-1 text-gray-500 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ChevronUp size={14} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); moveHighlight(highlight.id, "down"); }}
                      disabled={index === highlights.length - 1}
                      className="p-1 text-gray-500 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ChevronDown size={14} />
                    </button>
                  </div>
                  <div>
                    <h3 className="font-heading text-white">
                      {highlight.title || "New Highlight"}
                    </h3>
                    <p className="text-sm text-gray-400">
                      Icon: {highlight.icon}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); removeHighlight(highlight.id); }}
                    className="p-2 text-gray-400 hover:text-danger transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                  {expandedId === highlight.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </div>

              {expandedId === highlight.id && (
                <div className="p-4 pt-0 border-t border-primary/10 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Title"
                      value={highlight.title}
                      onChange={(e) => updateHighlight(highlight.id, "title", e.target.value)}
                      required
                      placeholder="Container Orchestration"
                    />
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Icon</label>
                      <select
                        value={highlight.icon}
                        onChange={(e) => updateHighlight(highlight.id, "icon", e.target.value)}
                        className="w-full px-4 py-3 bg-surface border border-primary/30 rounded text-white"
                      >
                        {availableIcons.map((icon) => (
                          <option key={icon} value={icon}>{icon}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <Textarea
                    label="Description"
                    value={highlight.description}
                    onChange={(e) => updateHighlight(highlight.id, "description", e.target.value)}
                    rows={2}
                    required
                    placeholder="Docker Swarm & Kubernetes expert with enterprise-grade deployments"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {highlights.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-400 mb-4">No highlights added yet</p>
            <Button onClick={addHighlight} leftIcon={<Plus size={18} />}>
              Add Your First Highlight
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
