import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-04-10",
});

async function main() {
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error("❌ STRIPE_SECRET_KEY manquant dans .env.local");
    process.exit(1);
  }

  console.log("🔧 Création des produits Stripe...\n");

  // Starter Plan
  const starterProduct = await stripe.products.create({
    name: "ResumeAI Starter",
    description: "10 analyses de CV par mois",
  });
  const starterPrice = await stripe.prices.create({
    product: starterProduct.id,
    unit_amount: 900, // 9.00 EUR
    currency: "eur",
    recurring: { interval: "month" },
  });

  console.log("✅ Starter créé :");
  console.log(`   Product ID : ${starterProduct.id}`);
  console.log(`   Price ID   : ${starterPrice.id}  ← copie ça dans .env.local\n`);

  // Pro Plan
  const proProduct = await stripe.products.create({
    name: "ResumeAI Pro",
    description: "Analyses illimitées + lettres de motivation",
  });
  const proPrice = await stripe.prices.create({
    product: proProduct.id,
    unit_amount: 2900, // 29.00 EUR
    currency: "eur",
    recurring: { interval: "month" },
  });

  console.log("✅ Pro créé :");
  console.log(`   Product ID : ${proProduct.id}`);
  console.log(`   Price ID   : ${proPrice.id}  ← copie ça dans .env.local\n`);

  console.log("📋 Mets à jour ton .env.local :");
  console.log(`STRIPE_PRICE_STARTER=${starterPrice.id}`);
  console.log(`STRIPE_PRICE_PRO=${proPrice.id}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
