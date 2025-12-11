"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui";
import { 
  Mail, 
  Trash2, 
  Loader2, 
  CheckCircle, 
  Circle,
  Reply,
  ChevronDown,
  ChevronUp,
  Inbox,
  MailOpen
} from "lucide-react";

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  read: boolean;
  replied: boolean;
  createdAt: string;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = () => {
    fetch("/api/messages")
      .then((r) => r.json())
      .then((data) => {
        setMessages(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const markAsRead = async (id: string, read: boolean) => {
    try {
      await fetch("/api/messages", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, read }),
      });
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, read } : m))
      );
    } catch (error) {
      console.error("Failed to update:", error);
    }
  };

  const markAsReplied = async (id: string) => {
    try {
      await fetch("/api/messages", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, replied: true, read: true }),
      });
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, replied: true, read: true } : m))
      );
    } catch (error) {
      console.error("Failed to update:", error);
    }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    
    try {
      await fetch(`/api/messages?id=${id}`, { method: "DELETE" });
      setMessages((prev) => prev.filter((m) => m.id !== id));
    } catch (error) {
      console.error("Failed to delete:", error);
    }
  };

  const filteredMessages = messages.filter((m) => {
    if (filter === "unread") return !m.read;
    if (filter === "read") return m.read;
    return true;
  });

  const unreadCount = messages.filter((m) => !m.read).length;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return date.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
    } else if (days === 1) {
      return "Yesterday";
    } else if (days < 7) {
      return date.toLocaleDateString("tr-TR", { weekday: "long" });
    } else {
      return date.toLocaleDateString("tr-TR");
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
          <h1 className="text-3xl font-heading text-white">Messages</h1>
          <p className="text-gray-400 mt-1">
            Contact form submissions
            {unreadCount > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-primary/20 text-primary text-sm rounded">
                {unreadCount} unread
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { key: "all", label: "All", count: messages.length },
          { key: "unread", label: "Unread", count: unreadCount },
          { key: "read", label: "Read", count: messages.length - unreadCount },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key as typeof filter)}
            className={`
              px-4 py-2 rounded-lg transition-colors flex items-center gap-2
              ${filter === tab.key
                ? "bg-primary/20 text-primary border border-primary/30"
                : "bg-surface text-gray-400 hover:text-white border border-transparent"}
            `}
          >
            {tab.label}
            <span className="text-xs opacity-60">({tab.count})</span>
          </button>
        ))}
      </div>

      {/* Messages List */}
      <div className="space-y-3">
        {filteredMessages.map((msg) => (
          <Card key={msg.id} className={!msg.read ? "border-primary/50" : ""}>
            <CardContent className="p-0">
              {/* Header */}
              <div
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-surface-light transition-colors"
                onClick={() => {
                  setExpandedId(expandedId === msg.id ? null : msg.id);
                  if (!msg.read) markAsRead(msg.id, true);
                }}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="flex-shrink-0">
                    {msg.read ? (
                      <MailOpen className="text-gray-400" size={20} />
                    ) : (
                      <Mail className="text-primary" size={20} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className={`font-heading truncate ${!msg.read ? "text-white" : "text-gray-400"}`}>
                        {msg.name}
                      </h3>
                      {msg.replied && (
                        <span className="flex-shrink-0 px-1.5 py-0.5 bg-success/20 text-success text-xs rounded">
                          Replied
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-400 truncate">
                      {msg.subject || msg.message.slice(0, 60)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                  <span className="text-xs text-gray-400">{formatDate(msg.createdAt)}</span>
                  {expandedId === msg.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </div>

              {/* Expanded content */}
              {expandedId === msg.id && (
                <div className="p-4 pt-0 border-t border-primary/10">
                  <div className="mb-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-400">From:</span>
                      <span className="text-white">{msg.name}</span>
                      <a href={`mailto:${msg.email}`} className="text-primary hover:underline">
                        ({msg.email})
                      </a>
                    </div>
                    {msg.subject && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-400">Subject:</span>
                        <span className="text-white">{msg.subject}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-400">Date:</span>
                      <span className="text-white">
                        {new Date(msg.createdAt).toLocaleString("tr-TR")}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 bg-surface-light rounded-lg mb-4">
                    <p className="text-white whitespace-pre-wrap">{msg.message}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <a
                        href={`mailto:${msg.email}?subject=Re: ${msg.subject || "Your message"}`}
                        onClick={() => markAsReplied(msg.id)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
                      >
                        <Reply size={16} />
                        Reply
                      </a>
                      {!msg.read ? (
                        <button
                          onClick={() => markAsRead(msg.id, true)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-surface text-gray-400 rounded-lg hover:text-white transition-colors"
                        >
                          <CheckCircle size={16} />
                          Mark as Read
                        </button>
                      ) : (
                        <button
                          onClick={() => markAsRead(msg.id, false)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-surface text-gray-400 rounded-lg hover:text-white transition-colors"
                        >
                          <Circle size={16} />
                          Mark as Unread
                        </button>
                      )}
                    </div>
                    <button
                      onClick={() => deleteMessage(msg.id)}
                      className="inline-flex items-center gap-2 px-4 py-2 text-danger hover:bg-danger/10 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMessages.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Inbox className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-400">
              {filter === "unread" 
                ? "No unread messages" 
                : filter === "read"
                ? "No read messages"
                : "No messages yet"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
