import Link from "next/link";
import { Check, Zap, Crown, FileText } from "lucide-react";
import { PLANS } from "@/lib/stripe";

export default function PricingPage() {
  const plans = [
    {
      key: "free",
      name: "Gratuit",
      price: 0,
      credits: 3,
      color: "border-ink/12",
      badge: null,
      features: [
        "3 analyses (offre unique)",
        "Score ATS",
        "Mots-clés manquants",
        "Points forts & faibles",
      ],
      cta: "Commencer gratuitement",
      href: "/auth",
    },
    {
      key: "starter",
      name: PLANS.starter.name,
      price: PLANS.starter.price,
      credits: PLANS.starter.credits,
      color: "border-sage/30 bg-sage/3",
      badge: "Populaire",
      features: PLANS.starter.features,
      cta: "Choisir Starter",
      href: null,
      planKey: "starter",
    },
    {
      key: "pro",
      name: PLANS.pro.name,
      price: PLANS.pro.price,
      credits: PLANS.pro.credits,
      color: "border-accent/30 bg-accent/3",
      badge: "Meilleure valeur",
      features: PLANS.pro.features,
      cta: "Choisir Pro",
      href: null,
      planKey: "pro",
    },
  ];

  return (
    <div className="min-h-screen bg-paper">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-paper/80 backdrop-blur-md border-b border-ink/8">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-ink rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-paper" />
            </div>
            <span className="font-display font-bold text-lg">ResumeAI</span>
          </Link>
          <Link href="/auth" className="btn-primary text-xs px-4 py-2">
            Commencer
          </Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h1 className="font-display text-5xl font-bold mb-4">
            Tarifs simples et transparents.
          </h1>
          <p className="text-muted font-body text-lg max-w-md mx-auto">
            Commencez gratuitement. Passez au plan payant quand vous êtes prêt.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.key}
              className={`card relative border-2 ${plan.color} ${
                plan.key === "pro" ? "scale-105 shadow-2xl" : ""
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold text-white ${
                    plan.key === "pro" ? "bg-accent" : "bg-sage"
                  }`}>
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  {plan.key === "pro" ? (
                    <Crown className="w-5 h-5 text-accent" />
                  ) : plan.key === "starter" ? (
                    <Zap className="w-5 h-5 text-sage" />
                  ) : (
                    <FileText className="w-5 h-5 text-muted" />
                  )}
                  <h3 className="font-display font-bold text-lg">{plan.name}</h3>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="font-display text-4xl font-bold">
                    {plan.price === 0 ? "0" : `${plan.price}`}€
                  </span>
                  {plan.price > 0 && (
                    <span className="text-muted font-body text-sm">/mois</span>
                  )}
                </div>

                <p className="text-xs text-muted font-body mt-1">
                  {plan.credits} analyse{plan.credits > 1 ? "s" : ""} par mois
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-sage flex-shrink-0 mt-0.5" />
                    <span className="text-sm font-body text-ink/80">{feature}</span>
                  </li>
                ))}
              </ul>

              {plan.href ? (
                <Link
                  href={plan.href}
                  className={`w-full justify-center ${
                    plan.key === "free" ? "btn-secondary" : "btn-primary"
                  }`}
                  style={{ display: "flex" }}
                >
                  {plan.cta}
                </Link>
              ) : (
                <CheckoutButton plan={plan.planKey!} label={plan.cta} isPro={plan.key === "pro"} />
              )}
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-muted font-body mt-8">
          Paiement sécurisé par Stripe · Annulable à tout moment · Sans engagement
        </p>
      </div>
    </div>
  );
}

// Client component for checkout
function CheckoutButton({ plan, label, isPro }: { plan: string; label: string; isPro: boolean }) {
  return (
    <form action="/api/checkout" method="POST">
      <input type="hidden" name="plan" value={plan} />
      <button
        type="submit"
        className={`w-full justify-center ${isPro ? "btn-accent" : "btn-primary"}`}
        style={{ display: "flex" }}
        formAction={`/upgrade?plan=${plan}`}
      >
        {label}
      </button>
    </form>
  );
}
