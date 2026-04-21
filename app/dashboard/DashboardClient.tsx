"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import {
  FileText, LogOut, Zap, History, Upload,
  ChevronRight, Crown, Plus, Loader2
} from "lucide-react";
import Link from "next/link";
import { UserProfile, Analysis } from "@/types";
import AnalysisForm from "@/components/AnalysisForm";
import AnalysisResult from "@/components/AnalysisResult";
import ScoreRing from "@/components/ScoreRing";

interface Props {
  profile: UserProfile;
  analyses: Analysis[];
}

export default function DashboardClient({ profile, analyses }: Props) {
  const [activeTab, setActiveTab] = useState<"new" | "history">("new");
  const [currentResult, setCurrentResult] = useState<Analysis | null>(null);
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  const isPro = profile?.plan === "pro";
  const isStarter = profile?.plan === "starter";
  const isFree = profile?.plan === "free";
  const credits = profile?.credits_remaining ?? 0;

  return (
    <div className="min-h-screen bg-paper">
      {/* Top nav */}
      <nav className="sticky top-0 z-50 bg-paper/90 backdrop-blur-md border-b border-ink/8">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-ink rounded-lg flex items-center justify-center">
              <FileText className="w-3.5 h-3.5 text-paper" />
            </div>
            <span className="font-display font-bold">ResumeAI</span>
            {isPro && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-accent/10 text-accent rounded-full text-xs font-mono">
                <Crown className="w-3 h-3" /> PRO
              </span>
            )}
            {isStarter && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-sage/10 text-sage rounded-full text-xs font-mono">
                STARTER
              </span>
            )}
          </div>

          <div className="flex items-center gap-4">
            {/* Credits badge */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-ink/5 rounded-full">
              <Zap className="w-3.5 h-3.5 text-accent" />
              <span className="text-xs font-mono font-semibold">
                {credits} crédit{credits !== 1 ? "s" : ""}
              </span>
            </div>

            {isFree && (
              <Link href="/upgrade" className="btn-accent text-xs px-4 py-2">
                <Crown className="w-3.5 h-3.5" /> Passer Pro
              </Link>
            )}

            <button
              onClick={handleLogout}
              className="p-2 rounded-lg hover:bg-ink/5 transition-colors text-muted hover:text-ink"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold">
            Bonjour{profile?.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""} 👋
          </h1>
          <p className="text-muted font-body mt-1 text-sm">
            {currentResult
              ? "Résultats de votre analyse"
              : "Analysez votre CV pour décrocher plus d'entretiens."}
          </p>
        </div>

        {/* Tabs */}
        {!currentResult && (
          <div className="flex gap-1 p-1 bg-ink/5 rounded-xl w-fit mb-8">
            {[
              { id: "new", label: "Nouvelle analyse", icon: <Plus className="w-3.5 h-3.5" /> },
              { id: "history", label: "Historique", icon: <History className="w-3.5 h-3.5" /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as "new" | "history")}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-display font-semibold transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-white shadow-sm text-ink"
                    : "text-muted hover:text-ink"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* Main content */}
        {currentResult ? (
          <AnalysisResult
            analysis={currentResult}
            isPro={isPro || isStarter}
            onBack={() => setCurrentResult(null)}
          />
        ) : activeTab === "new" ? (
          <div className="grid lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3">
              <AnalysisForm
                credits={credits}
                isPro={isPro}
                isStarter={isStarter}
                onResult={(analysis) => setCurrentResult(analysis)}
              />
            </div>
            <div className="lg:col-span-2 space-y-4">
              {/* Upgrade nudge for free users */}
              {isFree && (
                <div className="card border-accent/20 bg-accent/5">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 bg-accent/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Crown className="w-4 h-4 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-sm mb-1">
                        Passez au plan Pro
                      </h3>
                      <p className="text-xs text-muted font-body mb-3">
                        50 analyses/mois + lettre de motivation IA + comparaison offre/CV.
                      </p>
                      <Link href="/upgrade" className="btn-accent text-xs px-4 py-2">
                        Voir les plans <ChevronRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* Recent analyses preview */}
              {analyses.length > 0 && (
                <div className="card">
                  <h3 className="font-display font-semibold text-sm mb-4">
                    Dernières analyses
                  </h3>
                  <div className="space-y-3">
                    {analyses.slice(0, 3).map((a) => (
                      <button
                        key={a.id}
                        onClick={() => { setCurrentResult(a); }}
                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-ink/5 transition-colors text-left group"
                      >
                        <ScoreRing score={a.ats_score} size={40} />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-display font-semibold truncate">
                            {a.job_title}
                          </div>
                          <div className="text-xs text-muted">
                            {new Date(a.created_at).toLocaleDateString("fr-FR")}
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted group-hover:text-ink transition-colors flex-shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* History tab */
          <div>
            {analyses.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 bg-ink/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <History className="w-8 h-8 text-muted" />
                </div>
                <h3 className="font-display font-bold text-lg mb-2">Aucune analyse encore</h3>
                <p className="text-muted text-sm font-body mb-6">
                  Lancez votre première analyse pour voir les résultats ici.
                </p>
                <button onClick={() => setActiveTab("new")} className="btn-primary">
                  <Plus className="w-4 h-4" /> Nouvelle analyse
                </button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {analyses.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => { setCurrentResult(a); setActiveTab("new"); }}
                    className="card-hover text-left"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <ScoreRing score={a.ats_score} size={52} />
                      <span className="text-xs text-muted font-body">
                        {new Date(a.created_at).toLocaleDateString("fr-FR")}
                      </span>
                    </div>
                    <h3 className="font-display font-bold text-sm mb-1 line-clamp-2">
                      {a.job_title}
                    </h3>
                    <p className="text-xs text-muted font-body">
                      {(a.missing_keywords as string[]).length} mots-clés manquants ·{" "}
                      {(a.suggestions as string[]).length} suggestions
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
