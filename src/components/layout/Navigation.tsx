"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { clsx } from "clsx";

interface NavItem {
  label: string;
  href: string;
  apiEndpoint?: string; // If set, check this API for data
  alwaysShow?: boolean; // Always show regardless of data
}

const allNavItems: NavItem[] = [
  { label: "Home", href: "#home", alwaysShow: true },
  { label: "About", href: "#about", alwaysShow: true },
  { label: "Experience", href: "#experience", apiEndpoint: "/api/experience" },
  { label: "Skills", href: "#skills", apiEndpoint: "/api/skills" },
  { label: "Certifications", href: "#certifications", apiEndpoint: "/api/certifications" },
  { label: "Education", href: "#education", apiEndpoint: "/api/education" },
  { label: "Projects", href: "#projects", apiEndpoint: "/api/projects" },
  { label: "Contact", href: "#contact", alwaysShow: true },
];

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection] = useState("home");
  const [visibleNavItems, setVisibleNavItems] = useState<NavItem[]>(
    allNavItems.filter(item => item.alwaysShow)
  );

  // Check which sections have data
  useEffect(() => {
    async function checkSectionData() {
      const itemsWithData: NavItem[] = [];

      for (const item of allNavItems) {
        if (item.alwaysShow) {
          itemsWithData.push(item);
        } else if (item.apiEndpoint) {
          try {
            const res = await fetch(item.apiEndpoint);
            const data = await res.json();
            if (Array.isArray(data) && data.length > 0) {
              itemsWithData.push(item);
            }
          } catch {
            // Skip items that fail to fetch
          }
        }
      }

      setVisibleNavItems(itemsWithData);
    }

    checkSectionData();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={clsx(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled
            ? "bg-background/80 backdrop-blur-md border-b border-primary/10"
            : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              href="#home"
              className="font-heading text-xl text-primary hover:text-primary-light transition-colors"
            >
              {"<HS />"}
            </Link>

            {/* Desktop Navigation */}
            <ul className="hidden md:flex items-center gap-8">
              {visibleNavItems.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className={clsx(
                      "relative font-body text-sm uppercase tracking-wider transition-colors duration-300",
                      activeSection === item.href.slice(1)
                        ? "text-primary"
                        : "text-text-muted hover:text-primary"
                    )}
                  >
                    {item.label}
                    {activeSection === item.href.slice(1) && (
                      <motion.span
                        layoutId="activeSection"
                        className="absolute -bottom-1 left-0 right-0 h-px bg-primary"
                      />
                    )}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-text-muted hover:text-primary transition-colors"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-lg md:hidden"
          >
            <nav className="flex flex-col items-center justify-center h-full">
              <ul className="flex flex-col items-center gap-8">
                {visibleNavItems.map((item, index) => (
                  <motion.li
                    key={item.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="font-heading text-2xl text-text hover:text-primary transition-colors"
                    >
                      {item.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
