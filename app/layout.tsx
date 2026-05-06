import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Maryna's Job Tracker",
  description: "Job application pipeline",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen">{children}</body>
    </html>
  );
}
