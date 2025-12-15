"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button, Input, Textarea, Card } from "@/components/ui";
import { Send, Mail, MapPin, Github, Linkedin, Twitter, Globe } from "lucide-react";

interface Profile {
  email: string | null;
  location: string | null;
  github: string | null;
  linkedin: string | null;
  twitter: string | null;
  website: string | null;
}

export function ContactSection() {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    fetch("/api/profile")
      .then((res) => res.json())
      .then((data) => setProfile(data))
      .catch((err) => console.error("Failed to fetch profile:", err));
  }, []);

  const socialLinks = [
    profile?.github && { icon: Github, href: profile.github, label: "GitHub" },
    profile?.linkedin && { icon: Linkedin, href: profile.linkedin, label: "LinkedIn" },
    profile?.twitter && { icon: Twitter, href: profile.twitter, label: "Twitter" },
    profile?.email && { icon: Mail, href: `mailto:${profile.email}`, label: "Email" },
  ].filter(Boolean) as { icon: typeof Github; href: string; label: string }[];
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setFormState({ name: "", email: "", subject: "", message: "" });
      } else {
        setSubmitStatus("error");
      }
    } catch {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus("idle"), 5000);
    }
  };

  return (
    <section id="contact" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-mono text-sm tracking-widest uppercase">
            {"// Get in Touch"}
          </span>
          <h2 className="text-4xl md:text-5xl font-heading font-bold mt-4 mb-6">
            Let&apos;s <span className="text-gradient">Connect</span>
          </h2>
          <p className="text-text-muted max-w-2xl mx-auto text-lg">
            Have a project in mind or want to discuss opportunities? 
            I&apos;d love to hear from you.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Input
                    label="Name"
                    name="name"
                    placeholder="Your name"
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    required
                  />
                  <Input
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    required
                  />
                </div>
                <Input
                  label="Subject"
                  name="subject"
                  placeholder="What's this about?"
                  value={formState.subject}
                  onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                />
                <Textarea
                  label="Message"
                  name="message"
                  placeholder="Your message..."
                  rows={5}
                  value={formState.message}
                  onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                  required
                />

                {/* Status Messages */}
                {submitStatus === "success" && (
                  <p className="text-success text-sm">
                    Message sent successfully! I&apos;ll get back to you soon.
                  </p>
                )}
                {submitStatus === "error" && (
                  <p className="text-danger text-sm">
                    Failed to send message. Please try again later.
                  </p>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={isSubmitting}
                  rightIcon={<Send size={18} />}
                  className="w-full"
                >
                  Send Message
                </Button>
              </form>
            </Card>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col justify-between"
          >
            {/* Info Cards */}
            <div className="space-y-6 mb-8">
              {profile?.email && (
                <Card>
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-primary/10 text-primary">
                      <Mail size={24} />
                    </div>
                    <div>
                      <p className="text-text-muted text-sm">Email</p>
                      <a
                        href={`mailto:${profile.email}`}
                        className="text-text hover:text-primary transition-colors"
                      >
                        {profile.email}
                      </a>
                    </div>
                  </div>
                </Card>
              )}

              {profile?.location && (
                <Card>
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-accent/10 text-accent">
                      <MapPin size={24} />
                    </div>
                    <div>
                      <p className="text-text-muted text-sm">Location</p>
                      <p className="text-text">{profile.location}</p>
                    </div>
                  </div>
                </Card>
              )}

              {profile?.website && (
                <Card>
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-primary/10 text-primary">
                      <Globe size={24} />
                    </div>
                    <div>
                      <p className="text-text-muted text-sm">Website</p>
                      <a
                        href={profile.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-text hover:text-primary transition-colors"
                      >
                        {profile.website.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  </div>
                </Card>
              )}
            </div>

            {/* Social Links */}
            <div>
              <p className="text-text-muted mb-4">Find me on</p>
              <div className="flex gap-4">
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-surface border border-primary/20 rounded-lg text-text-muted hover:text-primary hover:border-primary/50 hover:shadow-neon-cyan transition-all duration-300"
                    aria-label={link.label}
                  >
                    <link.icon size={24} />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
