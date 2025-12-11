"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button, Input } from "@/components/ui";
import { Lock, Mail, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      {/* Background effects */}
      <div className="fixed inset-0 cyber-grid opacity-30" />
      <div 
        className="fixed inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 50% 0%, rgba(112, 0, 255, 0.1) 0%, transparent 50%),
            radial-gradient(ellipse at 0% 100%, rgba(0, 240, 255, 0.05) 0%, transparent 40%)
          `,
        }}
      />

      {/* Login card */}
      <div className="relative w-full max-w-md">
        <div className="cyber-card p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-heading text-primary mb-2">&lt;HS /&gt;</h1>
            <p className="text-gray-400">Admin Panel</p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 bg-danger/10 border border-danger/30 rounded-lg flex items-center gap-3">
              <AlertCircle className="text-danger" size={20} />
              <span className="text-danger text-sm">{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-12"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-12"
                required
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          {/* Back link */}
          <div className="mt-6 text-center">
            <a href="/" className="text-gray-400 hover:text-primary text-sm transition-colors">
              ← Back to site
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
