"use client";

import { useEffect, useState } from "react";
import { Button, Input, Card, CardContent } from "@/components/ui";
import { Save, Loader2, Palette, Sparkles, Grid, ScanLine } from "lucide-react";

interface Settings {
  id: string;
  siteTitle: string;
  siteDescription: string | null;
  theme: string;
  primaryColor: string;
  accentColor: string;
  showParticles: boolean;
  showGrid: boolean;
  showScanlines: boolean;
  particleCount: number;
  animationSpeed: number;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        setSettings(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const updateSettings = (field: keyof Settings, value: string | number | boolean) => {
    setSettings((prev) => prev ? { ...prev, [field]: value } : null);
  };

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    setMessage("");

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setMessage("Settings saved successfully!");
      } else {
        setMessage("Failed to save settings");
      }
    } catch {
      setMessage("An error occurred");
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
          <h1 className="text-3xl font-heading text-white">Settings</h1>
          <p className="text-gray-400 mt-1">Customize your portfolio appearance</p>
        </div>
        <Button onClick={handleSave} isLoading={saving} leftIcon={<Save size={18} />}>
          Save Settings
        </Button>
      </div>

      <div className="space-y-6">
        {/* Site Info */}
        <Card>
          <CardContent className="p-6">
            <h2 className="font-heading text-lg text-primary mb-4">Site Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Site Title"
                value={settings?.siteTitle || ""}
                onChange={(e) => updateSettings("siteTitle", e.target.value)}
              />
              <Input
                label="Site Description"
                value={settings?.siteDescription || ""}
                onChange={(e) => updateSettings("siteDescription", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Colors */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Palette className="text-primary" size={20} />
              <h2 className="font-heading text-lg text-primary">Colors</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Primary Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={settings?.primaryColor || "#00f0ff"}
                    onChange={(e) => updateSettings("primaryColor", e.target.value)}
                    className="w-12 h-12 rounded cursor-pointer border-0 bg-transparent"
                  />
                  <Input
                    value={settings?.primaryColor || "#00f0ff"}
                    onChange={(e) => updateSettings("primaryColor", e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">Accent Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={settings?.accentColor || "#f000ff"}
                    onChange={(e) => updateSettings("accentColor", e.target.value)}
                    className="w-12 h-12 rounded cursor-pointer border-0 bg-transparent"
                  />
                  <Input
                    value={settings?.accentColor || "#f000ff"}
                    onChange={(e) => updateSettings("accentColor", e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Visual Effects */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="text-primary" size={20} />
              <h2 className="font-heading text-lg text-primary">Visual Effects</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-surface-light rounded-lg">
                <div className="flex items-center gap-3">
                  <Sparkles className="text-accent" size={18} />
                  <div>
                    <p className="text-white">Particles</p>
                    <p className="text-xs text-gray-400">Floating particle animation</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings?.showParticles ?? true}
                    onChange={(e) => updateSettings("showParticles", e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-surface-light peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-text-muted after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary peer-checked:after:bg-background" />
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-surface-light rounded-lg">
                <div className="flex items-center gap-3">
                  <Grid className="text-accent" size={18} />
                  <div>
                    <p className="text-white">Grid</p>
                    <p className="text-xs text-gray-400">Background grid pattern</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings?.showGrid ?? true}
                    onChange={(e) => updateSettings("showGrid", e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-surface-light peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-text-muted after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary peer-checked:after:bg-background" />
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-surface-light rounded-lg">
                <div className="flex items-center gap-3">
                  <ScanLine className="text-accent" size={18} />
                  <div>
                    <p className="text-white">Scanlines</p>
                    <p className="text-xs text-gray-400">CRT scanline overlay</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings?.showScanlines ?? true}
                    onChange={(e) => updateSettings("showScanlines", e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-surface-light peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-text-muted after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary peer-checked:after:bg-background" />
                </label>
              </div>

              <div className="p-4 bg-surface-light rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-white">Particle Count</p>
                  <span className="text-sm text-primary">{settings?.particleCount || 100}</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="200"
                  value={settings?.particleCount || 100}
                  onChange={(e) => updateSettings("particleCount", parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {message && (
          <p className={`text-center ${message.includes("success") ? "text-success" : "text-danger"}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
