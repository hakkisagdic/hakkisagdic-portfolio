"use client";

import { useEffect, useState } from "react";
import { Button, Input, Textarea, Card, CardContent } from "@/components/ui";
import { Save, Loader2 } from "lucide-react";

interface Profile {
  id: string;
  name: string;
  headline: string | null;
  summary: string | null;
  photo: string | null;
  location: string | null;
  email: string | null;
  phone: string | null;
  linkedin: string | null;
  github: string | null;
  twitter: string | null;
  website: string | null;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((data) => {
        setProfile(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setSaving(true);
    setMessage("");

    try {
      const res = await fetch("/api/profile", {
        method: profile.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      if (res.ok) {
        setMessage("Profile saved successfully!");
        const updated = await res.json();
        setProfile(updated);
      } else {
        setMessage("Failed to save profile");
      }
    } catch {
      setMessage("An error occurred");
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: keyof Profile, value: string) => {
    setProfile((prev) => prev ? { ...prev, [field]: value || null } : null);
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
      <div className="mb-8">
        <h1 className="text-3xl font-heading text-white">Profile</h1>
        <p className="text-gray-400 mt-1">Manage your personal information</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardContent className="p-6 space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Full Name"
                value={profile?.name || ""}
                onChange={(e) => updateField("name", e.target.value)}
                required
              />
              <Input
                label="Headline"
                value={profile?.headline || ""}
                onChange={(e) => updateField("headline", e.target.value)}
                placeholder="DevOps Engineer"
              />
            </div>

            <Textarea
              label="Summary"
              value={profile?.summary || ""}
              onChange={(e) => updateField("summary", e.target.value)}
              rows={5}
              placeholder="Write a brief summary about yourself..."
            />

            {/* Contact */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Email"
                type="email"
                value={profile?.email || ""}
                onChange={(e) => updateField("email", e.target.value)}
              />
              <Input
                label="Phone"
                value={profile?.phone || ""}
                onChange={(e) => updateField("phone", e.target.value)}
              />
              <Input
                label="Location"
                value={profile?.location || ""}
                onChange={(e) => updateField("location", e.target.value)}
                placeholder="Istanbul, Turkey"
              />
              <Input
                label="Website"
                value={profile?.website || ""}
                onChange={(e) => updateField("website", e.target.value)}
                placeholder="https://example.com"
              />
            </div>

            {/* Social Links */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input
                label="LinkedIn"
                value={profile?.linkedin || ""}
                onChange={(e) => updateField("linkedin", e.target.value)}
                placeholder="https://linkedin.com/in/..."
              />
              <Input
                label="GitHub"
                value={profile?.github || ""}
                onChange={(e) => updateField("github", e.target.value)}
                placeholder="https://github.com/..."
              />
              <Input
                label="Twitter"
                value={profile?.twitter || ""}
                onChange={(e) => updateField("twitter", e.target.value)}
                placeholder="https://twitter.com/..."
              />
            </div>

            {/* Message */}
            {message && (
              <p className={`text-sm ${message.includes("success") ? "text-success" : "text-danger"}`}>
                {message}
              </p>
            )}

            {/* Submit */}
            <div className="flex justify-end">
              <Button type="submit" isLoading={saving} leftIcon={<Save size={18} />}>
                Save Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
