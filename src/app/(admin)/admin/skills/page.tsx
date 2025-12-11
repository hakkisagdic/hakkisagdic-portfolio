"use client";

import { useEffect, useState } from "react";
import { Button, Input, Card, CardContent } from "@/components/ui";
import { Plus, Trash2, Save, Loader2 } from "lucide-react";

interface Skill {
  id: string;
  name: string;
  category: string;
  level: number;
  icon: string | null;
  order: number;
}

const categories = ["Languages", "Frameworks", "DevOps", "Cloud", "Databases", "Tools", "General"];

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/skills")
      .then((r) => r.json())
      .then((data) => {
        setSkills(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const addSkill = () => {
    setSkills((prev) => [
      ...prev,
      {
        id: `new-${Date.now()}`,
        name: "",
        category: "General",
        level: 80,
        icon: null,
        order: prev.length,
      },
    ]);
  };

  const updateSkill = (id: string, field: keyof Skill, value: string | number) => {
    setSkills((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const removeSkill = async (id: string) => {
    if (id.startsWith("new-")) {
      setSkills((prev) => prev.filter((s) => s.id !== id));
      return;
    }

    try {
      await fetch(`/api/skills?id=${id}`, { method: "DELETE" });
      setSkills((prev) => prev.filter((s) => s.id !== id));
    } catch (error) {
      console.error("Failed to delete skill:", error);
    }
  };

  const saveAll = async () => {
    setSaving(true);
    try {
      for (const skill of skills) {
        if (skill.id.startsWith("new-")) {
          const { id, ...data } = skill;
          const res = await fetch("/api/skills", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });
          const newSkill = await res.json();
          setSkills((prev) =>
            prev.map((s) => (s.id === id ? newSkill : s))
          );
        } else {
          await fetch("/api/skills", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(skill),
          });
        }
      }
    } catch (error) {
      console.error("Failed to save skills:", error);
    } finally {
      setSaving(false);
    }
  };

  const groupedSkills = skills.reduce((acc, skill) => {
    const cat = skill.category || "General";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

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
          <h1 className="text-3xl font-heading text-white">Skills</h1>
          <p className="text-gray-400 mt-1">Manage your skills and expertise</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={addSkill} leftIcon={<Plus size={18} />}>
            Add Skill
          </Button>
          <Button onClick={saveAll} isLoading={saving} leftIcon={<Save size={18} />}>
            Save All
          </Button>
        </div>
      </div>

      {/* Skills by Category */}
      {categories.map((category) => {
        const categorySkills = groupedSkills[category] || [];
        if (categorySkills.length === 0 && category !== "General") return null;

        return (
          <div key={category} className="mb-8">
            <h2 className="text-lg font-heading text-primary mb-4">{category}</h2>
            <div className="space-y-3">
              {categorySkills.map((skill) => (
                <Card key={skill.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Input
                          placeholder="Skill name"
                          value={skill.name}
                          onChange={(e) => updateSkill(skill.id, "name", e.target.value)}
                        />
                        <select
                          value={skill.category}
                          onChange={(e) => updateSkill(skill.id, "category", e.target.value)}
                          className="px-4 py-3 bg-surface border border-primary/30 rounded text-white"
                        >
                          {categories.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                        <div className="flex items-center gap-2">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={skill.level}
                            onChange={(e) => updateSkill(skill.id, "level", parseInt(e.target.value))}
                            className="flex-1"
                          />
                          <span className="text-sm text-gray-400 w-10">{skill.level}%</span>
                        </div>
                        <Input
                          placeholder="Icon (optional)"
                          value={skill.icon || ""}
                          onChange={(e) => updateSkill(skill.id, "icon", e.target.value)}
                        />
                      </div>
                      <button
                        onClick={() => removeSkill(skill.id)}
                        className="p-2 text-gray-400 hover:text-danger transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
      })}

      {skills.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-400 mb-4">No skills added yet</p>
            <Button onClick={addSkill} leftIcon={<Plus size={18} />}>
              Add Your First Skill
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
