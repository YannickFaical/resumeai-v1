import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata: Metadata = {
  title: "ResumeAI — Optimisez votre CV pour les ATS",
  description:
    "Analysez votre CV avec l'IA, obtenez un score ATS et des suggestions concrètes pour décrocher plus d'entretiens.",
  openGraph: {
    title: "ResumeAI — Optimisez votre CV pour les ATS",
    description: "Analysez votre CV avec l'IA et multipliez vos chances.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body bg-paper text-ink antialiased">
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#0A0A0A",
              color: "#F5F2EB",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "14px",
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
