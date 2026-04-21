import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
});

export const PLANS = {
  starter: {
    name: "Starter",
    price: 9,
    priceId: "price_STARTER_ID",
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
    priceId: "price_PRO_ID",
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