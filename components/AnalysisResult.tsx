"use client";

import { useState } from "react";
import {
  ArrowLeft, CheckCircle, XCircle, Lightbulb,
  Tag, FileText, Copy, Check
} from "lucide-react";
import { Analysis } from "@/types";
import ScoreRing from "./ScoreRing";
import toast from "react-hot-toast";

interface Props {
  analysis: Analysis;
  isPro: boolean;
  onBack: () => void;
}

export default function AnalysisResult({ analysis, isPro, onBack }: Props) {
  const [copied, setCopied] = useState(false);

  const missing = analysis.missing_keywords as string[];
  const strengths = analysis.strengths as string[];
  const weaknesses = analysis.weaknesses as string[];
  const suggestions = analysis.suggestions as string[];

  async function copyCoverLetter() {
    if (!analysis.cover_letter) return;
    await navigator.clipboard.writeText(analysis.cover_letter);
    setCopied(true);
    toast.success("Copié !");
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back + header */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-muted hover:text-ink transition-colors font-body"
        >
          <ArrowLeft className="w-4 h-4" /> Retour
        </button>
        <div className="h-4 w-px bg-ink/15" />
        <h2 className="font-display font-bold text-lg truncate">{analysis.job_title}</h2>
        <span className="text-xs text-muted font-body ml-auto flex-shrink-0">
          {new Date(analysis.created_at).toLocaleDateString("fr-FR", {
            day: "numeric", month: "long", year: "numeric"
          })}
        </span>
      </div>

      {/* Score hero */}
      <div className="card bg-gradient-to-br from-white to-paper border-ink/10 flex items-center gap-8">
        <ScoreRing score={analysis.ats_score} size={100} />
        <div>
          <p className="text-xs font-mono text-muted uppercase tracking-widest mb-1">Score ATS</p>
          <h3 className="font-display text-3xl font-bold">
            {analysis.ats_score}/100
          </h3>
          <p className="text-sm text-muted font-body mt-1 max-w-sm">
            {analysis.ats_score >= 75
              ? "Excellent ! Votre CV est bien optimisé pour ce poste."
              : analysis.ats_score >= 50
              ? "Potentiel solide mais quelques ajustements sont nécessaires."
              : "Votre CV a besoin d'optimisations importantes pour passer les filtres ATS."}
          </p>
        </div>
      </div>

      {/* Grid of results */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Strengths */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-5 h-5 text-sage" />
            <h3 className="font-display font-bold text-sm">Points forts</h3>
            <span className="ml-auto text-xs font-mono text-sage bg-sage/10 px-2 py-0.5 rounded-full">
              {strengths.length}
            </span>
          </div>
          <ul className="space-y-2">
            {strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm font-body">
                <div className="w-1.5 h-1.5 bg-sage rounded-full mt-1.5 flex-shrink-0" />
                {s}
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <XCircle className="w-5 h-5 text-accent" />
            <h3 className="font-display font-bold text-sm">Points faibles</h3>
            <span className="ml-auto text-xs font-mono text-accent bg-accent/10 px-2 py-0.5 rounded-full">
              {weaknesses.length}
            </span>
          </div>
          <ul className="space-y-2">
            {weaknesses.map((w, i) => (
              <li key={i} className="flex items-start gap-2 text-sm font-body">
                <div className="w-1.5 h-1.5 bg-accent rounded-full mt-1.5 flex-shrink-0" />
                {w}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Missing keywords */}
      {missing.length > 0 && (
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <Tag className="w-5 h-5 text-ink/60" />
            <h3 className="font-display font-bold text-sm">
              Mots-clés manquants ({missing.length})
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {missing.map((kw) => (
              <span
                key={kw}
                className="px-3 py-1 bg-accent/8 border border-accent/20 rounded-full text-xs font-mono text-accent"
              >
                {kw}
              </span>
            ))}
          </div>
          <p className="text-xs text-muted font-body mt-3">
            💡 Intégrez ces termes naturellement dans votre CV pour améliorer votre score.
          </p>
        </div>
      )}

      {/* Suggestions */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-5 h-5 text-[#F59E0B]" />
          <h3 className="font-display font-bold text-sm">
            Suggestions d'amélioration
          </h3>
        </div>
        <ol className="space-y-3">
          {suggestions.map((s, i) => (
            <li key={i} className="flex items-start gap-3 text-sm font-body">
              <span className="w-5 h-5 bg-ink/8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-mono font-bold mt-0.5">
                {i + 1}
              </span>
              <span className="text-ink/80">{s}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Cover letter */}
      {analysis.cover_letter && (
        <div className="card border-sage/20 bg-sage/3">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-sage" />
              <h3 className="font-display font-bold text-sm">Lettre de motivation générée</h3>
            </div>
            <button
              onClick={copyCoverLetter}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-ink/15 rounded-lg text-xs font-display font-semibold hover:border-ink/30 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-sage" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copié !" : "Copier"}
            </button>
          </div>
          <div className="bg-white rounded-xl p-5 text-sm font-body text-ink/80 leading-relaxed whitespace-pre-wrap border border-ink/8">
            {analysis.cover_letter}
          </div>
        </div>
      )}
    </div>
  );
}
