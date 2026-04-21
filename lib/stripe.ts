import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
  typescript: true,
});

export const PLANS = {
  starter: {
    name: "Starter",
    price: 9,
    priceId: process.env.STRIPE_PRICE_STARTER!,
    credits: 10,
    features: [
      "10 analyses CV/mois",
      "Score ATS détaillé",
      "Rapport téléchargeable",
      "Support email",
    ],
  },
  pro: {
    name: "Pro",
    price: 29,
    priceId: process.env.STRIPE_PRICE_PRO!,
    credits: 50,
    features: [
      "50 analyses CV/mois",
      "Score ATS + suggestions IA",
      "Lettre de motivation IA",
      "Comparaison offre/CV",
      "Support prioritaire",
    ],
  },
} as const;
