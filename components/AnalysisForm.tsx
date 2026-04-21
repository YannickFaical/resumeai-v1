"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";
import { Upload, FileText, X, Loader2, Zap, Crown } from "lucide-react";
import { Analysis } from "@/types";
import Link from "next/link";

interface Props {
  credits: number;
  isPro: boolean;
  isStarter: boolean;
  onResult: (analysis: Analysis) => void;
}

export default function AnalysisForm({ credits, isPro, isStarter, onResult }: Props) {
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [cvText, setCvText] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [withCoverLetter, setWithCoverLetter] = useState(false);

  const canGenerateCoverLetter = isPro || isStarter;

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (file.type === "application/pdf") {
      setFileName(file.name);
      const formData = new FormData();
      formData.append("file", file);
      try {
        const res = await fetch("/api/parse-pdf", { method: "POST", body: formData });
        const data = await res.json();
        if (data.text) {
          setCvText(data.text);
          toast.success("PDF extrait avec succès !");
        }
      } catch {
        toast.error("Erreur lors de la lecture du PDF.");
      }
    } else if (file.type === "text/plain") {
      setFileName(file.name);
      const text = await file.text();
      setCvText(text);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"], "text/plain": [".txt"] },
    maxFiles: 1,
  });

  async function handleAnalyze() {
    if (!jobTitle.trim()) return toast.error("Entrez le titre du poste.");
    if (!jobDescription.trim()) return toast.error("Collez la description du poste.");
    if (!cvText.trim()) return toast.error("Uploadez ou collez votre CV.");
    if (credits <= 0) return toast.error("Plus de crédits. Passez à un plan payant.");

    setLoading(true);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobTitle, jobDescription, cvText, withCoverLetter }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur lors de l'analyse.");

      toast.success("Analyse terminée !");
      onResult(data.analysis);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Erreur inattendue.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      {/* Credits warning */}
      {credits === 0 && (
        <div className="p-4 bg-accent/10 border border-accent/20 rounded-xl flex items-center gap-3">
          <Zap className="w-5 h-5 text-accent flex-shrink-0" />
          <div>
            <p className="text-sm font-display font-semibold">Plus de crédits disponibles</p>
            <p className="text-xs text-muted font-body mt-0.5">
              Rechargez en passant à un plan payant.{" "}
              <Link href="/upgrade" className="text-accent underline">Voir les plans →</Link>
            </p>
          </div>
        </div>
      )}

      {/* Job title */}
      <div>
        <label className="text-xs font-display font-semibold text-muted uppercase tracking-wide block mb-1.5">
          Titre du poste *
        </label>
        <input
          type="text"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          placeholder="Ex: Développeur Java Senior, Data Analyst..."
          className="input-field"
        />
      </div>

      {/* Job description */}
      <div>
        <label className="text-xs font-display font-semibold text-muted uppercase tracking-wide block mb-1.5">
          Description du poste *
        </label>
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Collez ici la description complète de l'offre d'emploi..."
          rows={5}
          className="input-field resize-none"
        />
      </div>

      {/* CV upload */}
      <div>
        <label className="text-xs font-display font-semibold text-muted uppercase tracking-wide block mb-1.5">
          Votre CV *
        </label>

        {!cvText ? (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
              isDragActive
                ? "border-accent bg-accent/5"
                : "border-ink/15 hover:border-ink/30 hover:bg-ink/2"
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="w-8 h-8 text-muted mx-auto mb-3" />
            <p className="text-sm font-display font-semibold mb-1">
              {isDragActive ? "Déposez ici..." : "Glissez votre CV ou cliquez"}
            </p>
            <p className="text-xs text-muted font-body">PDF ou TXT acceptés</p>
          </div>
        ) : (
          <div className="flex items-center gap-3 p-3 bg-sage/5 border border-sage/20 rounded-xl">
            <div className="w-9 h-9 bg-sage/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <FileText className="w-4 h-4 text-sage" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-display font-semibold truncate">
                {fileName || "CV collé manuellement"}
              </p>
              <p className="text-xs text-muted font-body">
                {cvText.length} caractères extraits
              </p>
            </div>
            <button
              onClick={() => { setCvText(""); setFileName(null); }}
              className="p-1.5 hover:bg-ink/5 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-muted" />
            </button>
          </div>
        )}

        {/* Or paste manually */}
        {!cvText && (
          <details className="mt-3">
            <summary className="text-xs text-muted font-body cursor-pointer hover:text-ink transition-colors">
              Ou coller le texte manuellement
            </summary>
            <textarea
              value={cvText}
              onChange={(e) => setCvText(e.target.value)}
              placeholder="Collez le texte de votre CV ici..."
              rows={6}
              className="input-field mt-2 resize-none"
            />
          </details>
        )}
      </div>

      {/* Cover letter option */}
      {canGenerateCoverLetter && (
        <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl hover:bg-ink/3 transition-colors">
          <div
            onClick={() => setWithCoverLetter(!withCoverLetter)}
            className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
              withCoverLetter
                ? "bg-accent border-accent"
                : "border-ink/20"
            }`}
          >
            {withCoverLetter && (
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
          <div>
            <p className="text-sm font-display font-semibold">
              Générer une lettre de motivation IA
            </p>
            <p className="text-xs text-muted font-body">
              Personnalisée pour ce poste (+1 crédit)
            </p>
          </div>
        </label>
      )}

      {!canGenerateCoverLetter && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-ink/3 opacity-70">
          <Crown className="w-4 h-4 text-muted flex-shrink-0" />
          <p className="text-xs text-muted font-body">
            Lettre de motivation IA disponible dès le plan Starter.{" "}
            <Link href="/upgrade" className="text-accent underline">Passer à Starter →</Link>
          </p>
        </div>
      )}

      {/* Submit */}
      <button
        onClick={handleAnalyze}
        disabled={loading || credits <= 0}
        className="btn-accent w-full justify-center py-4 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Analyse en cours (20–30s)...
          </>
        ) : (
          <>
            <Zap className="w-4 h-4" />
            Analyser mon CV
            <span className="text-xs opacity-70 font-mono">({credits} crédit{credits !== 1 ? "s" : ""})</span>
          </>
        )}
      </button>
    </div>
  );
}
