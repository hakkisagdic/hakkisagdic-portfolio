import type { Metadata, Viewport } from "next";
import { Orbitron, Rajdhani, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// Fonts
const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  display: "swap",
});

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-rajdhani",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

// Metadata
export const metadata: Metadata = {
  title: {
    default: "Hakkı Sağdıç | DevOps Engineer",
    template: "%s | Hakkı Sağdıç",
  },
  description: "DevOps Engineer specializing in Docker, Kubernetes, Azure, and cloud-native solutions.",
  keywords: ["DevOps", "Docker", "Kubernetes", "Azure", "Cloud", "Portfolio"],
  authors: [{ name: "Hakkı Sağdıç" }],
  creator: "Hakkı Sağdıç",
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://hakkisagdic.dev",
    siteName: "Hakkı Sağdıç Portfolio",
    title: "Hakkı Sağdıç | DevOps Engineer",
    description: "DevOps Engineer specializing in Docker, Kubernetes, Azure, and cloud-native solutions.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hakkı Sağdıç | DevOps Engineer",
    description: "DevOps Engineer specializing in Docker, Kubernetes, Azure, and cloud-native solutions.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0f",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html 
      lang="tr" 
      className={`${orbitron.variable} ${rajdhani.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen bg-background text-text overflow-x-hidden">
        {/* Scanlines overlay */}
        <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03]">
          <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,240,255,0.03)_2px,rgba(0,240,255,0.03)_4px)]" />
        </div>
        
        {/* Main content */}
        {children}
      </body>
    </html>
  );
}
