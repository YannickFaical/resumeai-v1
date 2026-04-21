"use client";
import Link from "next/link";
import {
  FileText,
  Zap,
  Target,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Star,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-paper/80 backdrop-blur-md border-b border-ink/8">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-ink rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-paper" />
            </div>
            <span className="font-display font-bold text-lg">ResumeAI</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/pricing" className="text-sm text-muted hover:text-ink transition-colors font-body">
              Tarifs
            </Link>
            <Link href="/auth" className="btn-primary text-xs px-4 py-2">
              Commencer gratuitement
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-24 pb-16">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-sage/10 border border-sage/20 rounded-full mb-8 animate-fade-in">
            <div className="w-1.5 h-1.5 bg-sage rounded-full animate-pulse" />
            <span className="text-xs font-mono text-sage">Propulsé par GPT-4o</span>
          </div>

          <h1 className="font-display text-5xl md:text-7xl font-bold leading-[0.95] tracking-tight mb-8 opacity-0 animate-fade-up" style={{ animationFillMode: "forwards" }}>
            Votre CV,
            <br />
            <span className="text-accent">optimisé</span>
            <br />
            pour les ATS.
          </h1>

          <p className="text-lg text-muted font-body leading-relaxed max-w-xl mb-10 opacity-0 animate-fade-up delay-200" style={{ animationFillMode: "forwards" }}>
            90% des CVs sont rejetés automatiquement avant d'atteindre un recruteur.
            Analysez le vôtre en 30 secondes et obtenez un score ATS + des suggestions concrètes.
          </p>

          <div className="flex items-center gap-4 opacity-0 animate-fade-up delay-300" style={{ animationFillMode: "forwards" }}>
            <Link href="/auth" className="btn-accent">
              Analyser mon CV gratuitement
              <ArrowRight className="w-4 h-4" />
            </Link>
            <span className="text-xs text-muted font-body">3 analyses offertes · Sans CB</span>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-6 mt-20 pt-12 border-t border-ink/8 opacity-0 animate-fade-up delay-400" style={{ animationFillMode: "forwards" }}>
          {[
            { value: "90%", label: "CVs rejetés par les ATS" },
            { value: "30s", label: "Temps d'analyse" },
            { value: "+3×", label: "Plus d'entretiens obtenus" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="font-display text-4xl font-bold text-ink">{stat.value}</div>
              <div className="text-sm text-muted mt-1 font-body">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-ink text-paper py-24">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="font-display text-4xl font-bold mb-4">
            Simple comme bonjour.
          </h2>
          <p className="text-paper/60 font-body mb-16 max-w-lg">
            En 3 étapes, obtenez un rapport complet sur votre CV et les actions à prendre.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                icon: <FileText className="w-6 h-6" />,
                title: "Uploadez votre CV",
                desc: "PDF ou texte. Notre IA extrait automatiquement le contenu.",
              },
              {
                step: "02",
                icon: <Target className="w-6 h-6" />,
                title: "Collez l'offre d'emploi",
                desc: "Copiez-collez la description du poste visé pour une analyse ciblée.",
              },
              {
                step: "03",
                icon: <TrendingUp className="w-6 h-6" />,
                title: "Obtenez votre score",
                desc: "Score ATS, mots-clés manquants, forces, faiblesses et suggestions.",
              },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="font-mono text-6xl font-bold text-paper/8 absolute -top-4 -left-2 select-none">
                  {item.step}
                </div>
                <div className="relative z-10 pt-8">
                  <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center mb-4 text-accent">
                    {item.icon}
                  </div>
                  <h3 className="font-display font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-paper/60 text-sm font-body leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 max-w-6xl mx-auto px-6">
        <h2 className="font-display text-4xl font-bold mb-16 text-center">
          Tout ce dont vous avez besoin.
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { icon: <Zap className="w-5 h-5" />, title: "Score ATS précis", desc: "Algorithme calibré sur les ATS réels (Workday, Greenhouse, Lever)." },
            { icon: <Target className="w-5 h-5" />, title: "Mots-clés manquants", desc: "Identifiez exactement quels termes ajouter pour passer les filtres." },
            { icon: <CheckCircle className="w-5 h-5" />, title: "Suggestions actionnables", desc: "Des recommandations précises, pas des généralités." },
            { icon: <FileText className="w-5 h-5" />, title: "Lettre de motivation IA", desc: "Générez une lettre personnalisée pour chaque offre (plan Pro)." },
            { icon: <TrendingUp className="w-5 h-5" />, title: "Historique des analyses", desc: "Suivez l'évolution de votre CV au fil des candidatures." },
            { icon: <Star className="w-5 h-5" />, title: "Support expert", desc: "Email ou prioritaire selon votre plan." },
          ].map((feat) => (
            <div key={feat.title} className="card-hover">
              <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center mb-4 text-accent">
                {feat.icon}
              </div>
              <h3 className="font-display font-semibold mb-2">{feat.title}</h3>
              <p className="text-sm text-muted font-body leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-ink/5 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="font-display text-3xl font-bold mb-12 text-center">
            Ils ont décroché leurs entretiens.
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Sophia M.",
                role: "Développeuse Full-Stack",
                text: "Mon CV était à 42/100. Après les corrections suggérées par ResumeAI, j'ai eu 4 entretiens en une semaine.",
              },
              {
                name: "Karim B.",
                role: "Chef de projet IT",
                text: "J'envoyais des CVs dans le vide. ResumeAI m'a montré exactement pourquoi — et comment corriger ça.",
              },
              {
                name: "Amira T.",
                role: "Data Analyst",
                text: "La lettre de motivation générée pour chaque offre est bluffante. Ça m'économise 2h par candidature.",
              },
            ].map((t) => (
              <div key={t.name} className="card">
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-sm font-body text-ink/80 leading-relaxed mb-4">"{t.text}"</p>
                <div>
                  <div className="font-display font-semibold text-sm">{t.name}</div>
                  <div className="text-xs text-muted">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 max-w-6xl mx-auto px-6 text-center">
        <h2 className="font-display text-5xl font-bold mb-6">
          Prêt à décrocher<br />plus d'entretiens ?
        </h2>
        <p className="text-muted font-body mb-10 max-w-md mx-auto">
          Commencez gratuitement avec 3 analyses. Aucune carte bancaire requise.
        </p>
        <Link href="/auth" className="btn-accent">
          Analyser mon CV maintenant
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-ink/8 py-8">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-ink rounded-md flex items-center justify-center">
              <FileText className="w-3 h-3 text-paper" />
            </div>
            <span className="font-display font-bold text-sm">ResumeAI</span>
          </div>
          <div className="flex gap-6 text-xs text-muted font-body">
            <Link href="/pricing" className="hover:text-ink transition-colors">Tarifs</Link>
            <a href="mailto:hello@resumeai.app" className="hover:text-ink transition-colors">Contact</a>
          </div>
          <div className="text-xs text-muted font-body">
            © {new Date().getFullYear()} ResumeAI
          </div>
        </div>
      </footer>
    </div>
  );
}

export const dynamic = "force-dynamic";