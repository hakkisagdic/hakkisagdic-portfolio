"use client";

import { useEffect, useState } from "react";
import { Button, Input, Textarea, Card, CardContent } from "@/components/ui";
import { Plus, Trash2, Save, Loader2, ChevronDown, ChevronUp, ExternalLink, Github, Star } from "lucide-react";

interface Project {
  id: string;
  title: string;
  description: string | null;
  image: string | null;
  url: string | null;
  github: string | null;
  tags: string[];
  featured: boolean;
  order: number;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then((data) => {
        setProjects(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const addProject = () => {
    const newProject: Project = {
      id: `new-${Date.now()}`,
      title: "",
      description: null,
      image: null,
      url: null,
      github: null,
      tags: [],
      featured: false,
      order: projects.length,
    };
    setProjects((prev) => [newProject, ...prev]);
    setExpandedId(newProject.id);
  };

  const updateProject = (id: string, field: keyof Project, value: string | boolean | string[]) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const addTag = (id: string) => {
    const tag = tagInput[id]?.trim();
    if (!tag) return;
    
    const project = projects.find((p) => p.id === id);
    if (project && !project.tags.includes(tag)) {
      updateProject(id, "tags", [...project.tags, tag]);
    }
    setTagInput((prev) => ({ ...prev, [id]: "" }));
  };

  const removeTag = (id: string, tag: string) => {
    const project = projects.find((p) => p.id === id);
    if (project) {
      updateProject(id, "tags", project.tags.filter((t) => t !== tag));
    }
  };

  const removeProject = async (id: string) => {
    if (id.startsWith("new-")) {
      setProjects((prev) => prev.filter((p) => p.id !== id));
      return;
    }

    try {
      await fetch(`/api/projects?id=${id}`, { method: "DELETE" });
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Failed to delete:", error);
    }
  };

  const saveAll = async () => {
    setSaving(true);
    try {
      for (const project of projects) {
        if (project.id.startsWith("new-")) {
          const { id, ...data } = project;
          const res = await fetch("/api/projects", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });
          const newProject = await res.json();
          setProjects((prev) => prev.map((p) => (p.id === id ? newProject : p)));
        } else {
          await fetch("/api/projects", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(project),
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
          <h1 className="text-3xl font-heading text-white">Projects</h1>
          <p className="text-gray-400 mt-1">Showcase your work and portfolio projects</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={addProject} leftIcon={<Plus size={18} />}>
            Add Project
          </Button>
          <Button onClick={saveAll} isLoading={saving} leftIcon={<Save size={18} />}>
            Save All
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {projects.map((project) => (
          <Card key={project.id}>
            <CardContent className="p-0">
              {/* Header */}
              <div
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-surface-light transition-colors"
                onClick={() => setExpandedId(expandedId === project.id ? null : project.id)}
              >
                <div className="flex items-center gap-3">
                  {project.featured && <Star className="text-warning fill-warning" size={16} />}
                  <div>
                    <h3 className="font-heading text-white">{project.title || "New Project"}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      {project.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded">
                          {tag}
                        </span>
                      ))}
                      {project.tags.length > 3 && (
                        <span className="text-xs text-gray-400">+{project.tags.length - 3}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {project.url && <ExternalLink size={16} className="text-gray-400" />}
                  {project.github && <Github size={16} className="text-gray-400" />}
                  <button
                    onClick={(e) => { e.stopPropagation(); removeProject(project.id); }}
                    className="p-2 text-gray-400 hover:text-danger transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                  {expandedId === project.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </div>

              {/* Expanded form */}
              {expandedId === project.id && (
                <div className="p-4 pt-0 border-t border-primary/10 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Project Title"
                      value={project.title}
                      onChange={(e) => updateProject(project.id, "title", e.target.value)}
                      required
                    />
                    <Input
                      label="Image URL"
                      value={project.image || ""}
                      onChange={(e) => updateProject(project.id, "image", e.target.value)}
                      placeholder="https://example.com/image.png"
                    />
                    <Input
                      label="Live URL"
                      value={project.url || ""}
                      onChange={(e) => updateProject(project.id, "url", e.target.value)}
                      placeholder="https://project.example.com"
                    />
                    <Input
                      label="GitHub URL"
                      value={project.github || ""}
                      onChange={(e) => updateProject(project.id, "github", e.target.value)}
                      placeholder="https://github.com/user/repo"
                    />
                  </div>

                  <Textarea
                    label="Description"
                    value={project.description || ""}
                    onChange={(e) => updateProject(project.id, "description", e.target.value)}
                    rows={4}
                    placeholder="Describe your project..."
                  />

                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Tags</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-sm rounded"
                        >
                          {tag}
                          <button
                            onClick={() => removeTag(project.id, tag)}
                            className="hover:text-danger"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        value={tagInput[project.id] || ""}
                        onChange={(e) => setTagInput((prev) => ({ ...prev, [project.id]: e.target.value }))}
                        placeholder="Add tag..."
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag(project.id))}
                      />
                      <Button variant="outline" onClick={() => addTag(project.id)}>
                        Add
                      </Button>
                    </div>
                  </div>

                  {/* Featured toggle */}
                  <div className="flex items-center gap-3 p-4 bg-surface-light rounded-lg">
                    <input
                      type="checkbox"
                      id={`featured-${project.id}`}
                      checked={project.featured}
                      onChange={(e) => updateProject(project.id, "featured", e.target.checked)}
                      className="w-4 h-4"
                    />
                    <label htmlFor={`featured-${project.id}`} className="flex items-center gap-2">
                      <Star size={16} className={project.featured ? "text-warning fill-warning" : "text-gray-400"} />
                      <span className="text-white">Featured Project</span>
                      <span className="text-xs text-gray-400">(Highlighted on homepage)</span>
                    </label>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {projects.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-400 mb-4">No projects added yet</p>
            <Button onClick={addProject} leftIcon={<Plus size={18} />}>
              Add Your First Project
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
