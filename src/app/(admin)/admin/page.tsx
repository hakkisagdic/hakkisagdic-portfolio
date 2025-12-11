"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui";
import { 
  User, 
  Briefcase, 
  GraduationCap, 
  Wrench, 
  Mail, 
  Eye,
  FolderKanban,
  Award,
  MessageSquare
} from "lucide-react";
import Link from "next/link";

interface Stats {
  profile: boolean;
  experiences: number;
  education: number;
  skills: number;
  projects: number;
  certifications: number;
  messages: number;
  unreadMessages: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    profile: false,
    experiences: 0,
    education: 0,
    skills: 0,
    projects: 0,
    certifications: 0,
    messages: 0,
    unreadMessages: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [profile, experience, education, skills, projects, certifications, messages] = await Promise.all([
          fetch("/api/profile").then((r) => r.json()),
          fetch("/api/experience").then((r) => r.json()),
          fetch("/api/education").then((r) => r.json()),
          fetch("/api/skills").then((r) => r.json()),
          fetch("/api/projects").then((r) => r.json()),
          fetch("/api/certifications").then((r) => r.json()),
          fetch("/api/messages").then((r) => r.json()),
        ]);

        const messagesList = Array.isArray(messages) ? messages : [];
        
        setStats({
          profile: !!profile?.id,
          experiences: Array.isArray(experience) ? experience.length : 0,
          education: Array.isArray(education) ? education.length : 0,
          skills: Array.isArray(skills) ? skills.length : 0,
          projects: Array.isArray(projects) ? projects.length : 0,
          certifications: Array.isArray(certifications) ? certifications.length : 0,
          messages: messagesList.length,
          unreadMessages: messagesList.filter((m: { read: boolean }) => !m.read).length,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const statCards = [
    { 
      title: "Profile", 
      value: stats.profile ? "Complete" : "Incomplete", 
      icon: User, 
      href: "/admin/profile",
      color: stats.profile ? "text-success" : "text-warning"
    },
    { 
      title: "Experience", 
      value: stats.experiences, 
      icon: Briefcase, 
      href: "/admin/experience",
      color: "text-primary"
    },
    { 
      title: "Education", 
      value: stats.education, 
      icon: GraduationCap, 
      href: "/admin/education",
      color: "text-accent"
    },
    { 
      title: "Skills", 
      value: stats.skills, 
      icon: Wrench, 
      href: "/admin/skills",
      color: "text-secondary"
    },
    { 
      title: "Projects", 
      value: stats.projects, 
      icon: FolderKanban, 
      href: "/admin/projects",
      color: "text-primary"
    },
    { 
      title: "Certifications", 
      value: stats.certifications, 
      icon: Award, 
      href: "/admin/certifications",
      color: "text-warning"
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading text-white">Dashboard</h1>
          <p className="text-gray-400 mt-1">Welcome to your portfolio admin panel</p>
        </div>
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 px-4 py-2 bg-surface border border-primary/30 rounded-lg text-primary hover:border-primary transition-colors"
        >
          <Eye size={18} />
          <span>View Site</span>
        </Link>
      </div>

      {/* Messages Alert */}
      {stats.unreadMessages > 0 && (
        <Link href="/admin/messages">
          <Card className="border-primary/50 bg-primary/5 hover:border-primary transition-colors">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                <MessageSquare className="text-primary" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-heading text-white">New Messages</h3>
                <p className="text-sm text-gray-400">
                  You have {stats.unreadMessages} unread message{stats.unreadMessages > 1 ? "s" : ""}
                </p>
              </div>
              <div className="text-3xl font-heading text-primary">{stats.unreadMessages}</div>
            </CardContent>
          </Card>
        </Link>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card) => (
          <Link key={card.title} href={card.href}>
            <Card className="h-full hover:border-primary/50 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <card.icon className={card.color} size={24} />
                  <span className="text-xs text-gray-400 uppercase tracking-wider">
                    {card.title}
                  </span>
                </div>
                <div className={`text-3xl font-heading ${card.color}`}>
                  {loading ? "..." : card.value}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-heading text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link href="/admin/import">
            <Card className="hover:border-primary/50 transition-colors">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Mail className="text-primary" size={24} />
                </div>
                <div>
                  <h3 className="font-heading text-white">Import LinkedIn</h3>
                  <p className="text-sm text-gray-400">Import your LinkedIn data</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/profile">
            <Card className="hover:border-primary/50 transition-colors">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                  <User className="text-accent" size={24} />
                </div>
                <div>
                  <h3 className="font-heading text-white">Edit Profile</h3>
                  <p className="text-sm text-gray-400">Update your information</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/projects">
            <Card className="hover:border-primary/50 transition-colors">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <FolderKanban className="text-secondary" size={24} />
                </div>
                <div>
                  <h3 className="font-heading text-white">Add Project</h3>
                  <p className="text-sm text-gray-400">Showcase your work</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
