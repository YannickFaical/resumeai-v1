"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Check, Crown, Zap, FileText, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { PLANS } from "@/lib/stripe";

export default function UpgradePage() {
  const [loading, setLoading] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("canceled")) {
      toast.error("Paiement annulé.");
    }
    const plan = searchParams.get("plan");
    if (plan) {
      handleCheckout(plan);
    }
  }, []);

  async function handleCheckout(plan: string) {
    setLoading(plan);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          window.location.href = "/auth";
          return;
        }
        throw new Error(data.error || "Erreur lors du paiement.");
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Erreur inattendue.");
      setLoading(null);
    }
  }

  const plans = [
    {
      key: "starter",
      ...PLANS.starter,
      icon: <Zap className="w-5 h-5 text-sage" />,
      color: "border-sage/30",
      accent: "bg-sage",
      highlighted: false,
    },
    {
      key: "pro",
      ...PLANS.pro,
      icon: <Crown className="w-5 h-5 text-accent" />,
      color: "border-accent/30",
      accent: "bg-accent",
      highlighted: true,
    },
  ];

  return (
    <div className="min-h-screen bg-paper">
      <nav className="sticky top-0 z-50 bg-paper/80 backdrop-blur-md border-b border-ink/8">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center gap-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-sm text-muted hover:text-ink transition-colors font-body"
          >
            <ArrowLeft className="w-4 h-4" /> Retour
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-ink rounded-lg flex items-center justify-center">
              <FileText className="w-3.5 h-3.5 text-paper" />
            </div>
            <span className="font-display font-bold">ResumeAI</span>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl font-bold mb-3">
            Choisissez votre plan
          </h1>
          <p className="text-muted font-body">
            Abonnement mensuel · Annulable à tout moment · Paiement sécurisé Stripe
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.key}
              className={`card border-2 ${plan.color} ${plan.highlighted ? "shadow-xl" : ""} relative`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-1 bg-accent rounded-full text-xs font-mono font-bold text-white">
                    Recommandé
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2 mb-4">
                {plan.icon}
                <h3 className="font-display font-bold text-xl">{plan.name}</h3>
              </div>

              <div className="mb-6">
                <span className="font-display text-4xl font-bold">{plan.price}€</span>
                <span className="text-muted font-body text-sm ml-1">/mois</span>
                <p className="text-xs text-muted mt-1 font-body">
                  {plan.credits} analyses par mois
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm font-body">
                    <Check className="w-4 h-4 text-sage flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleCheckout(plan.key)}
                disabled={loading !== null}
                className={`w-full justify-center flex items-center gap-2 py-3 rounded-full font-display font-semibold text-sm transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed ${
                  plan.highlighted
                    ? "bg-accent text-white hover:bg-[#d14820]"
                    : "bg-ink text-paper hover:bg-sage"
                }`}
              >
                {loading === plan.key ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    {plan.icon}
                    Choisir {plan.name}
                  </>
                )}
              </button>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-muted font-body mt-6">
          🔒 Paiement 100% sécurisé par Stripe. Nous ne stockons jamais vos données bancaires.
        </p>
      </div>
    </div>
  );
}
