# 🚀 ResumeAI — SaaS de Scoring CV par IA

> Analysez votre CV par rapport à une offre d'emploi, obtenez un score ATS, des mots-clés manquants, et une lettre de motivation générée par GPT-4o.

## 💡 Concept

**Problème :** 90% des CVs sont rejetés par des ATS avant qu'un recruteur les lise.  
**Solution :** Upload CV + colle l'offre → score ATS + suggestions concrètes en 30 secondes.  
**Monétisation :** Freemium (3 analyses gratuites) → Starter 9€/mois → Pro 29€/mois.

---

## 🏗️ Architecture

```
Landing (Next.js)
    ↓
Auth (Supabase Auth)
    ↓
Dashboard → API /analyze → OpenAI GPT-4o-mini → Supabase DB
                        → Stripe Checkout / Webhooks
```

**Stack :**
- **Frontend/Backend :** Next.js 14 App Router (full-stack)
- **Auth + DB :** Supabase (PostgreSQL + Row Level Security)
- **Paiement :** Stripe (abonnements mensuels)
- **IA :** OpenAI GPT-4o-mini
- **Déploiement :** Vercel

---

## 📁 Structure des fichiers

```
resumeai/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── layout.tsx                  # Root layout
│   ├── globals.css                 # Styles globaux
│   ├── auth/
│   │   ├── page.tsx                # Login / Signup
│   │   └── callback/route.ts       # OAuth callback
│   ├── dashboard/
│   │   ├── page.tsx                # Dashboard (server)
│   │   └── DashboardClient.tsx     # Dashboard (client)
│   ├── pricing/page.tsx            # Page tarifs
│   ├── upgrade/page.tsx            # Checkout Stripe
│   └── api/
│       ├── analyze/route.ts        # POST - analyse CV
│       ├── parse-pdf/route.ts      # POST - extraction PDF
│       ├── checkout/route.ts       # POST - session Stripe
│       ├── portal/route.ts         # POST - portail client
│       └── webhooks/route.ts       # POST - webhooks Stripe
├── components/
│   ├── AnalysisForm.tsx            # Formulaire d'analyse
│   ├── AnalysisResult.tsx          # Affichage des résultats
│   └── ScoreRing.tsx               # Ring SVG du score
├── lib/
│   ├── supabase/
│   │   ├── client.ts               # Client navigateur
│   │   └── server.ts               # Client serveur + admin
│   ├── stripe.ts                   # Stripe + plans
│   └── openai.ts                   # Service d'analyse IA
├── types/index.ts                  # Types TypeScript
├── middleware.ts                   # Protection des routes
└── supabase/migrations/
    └── 001_initial_schema.sql      # Schéma complet
```

---

## ⚡ Lancer en local (10 minutes)

### 1. Cloner et installer

```bash
git clone https://github.com/ton-repo/resumeai.git
cd resumeai
npm install
cp .env.local.example .env.local
```

### 2. Créer le projet Supabase

1. Va sur [supabase.com](https://supabase.com) → New project
2. Copie dans `.env.local` :
   - `NEXT_PUBLIC_SUPABASE_URL` → Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` → anon/public key
   - `SUPABASE_SERVICE_ROLE_KEY` → service_role key

3. Dans Supabase → **SQL Editor**, exécute le contenu de :
   ```
   supabase/migrations/001_initial_schema.sql
   ```

4. Dans Supabase → **Authentication → URL Configuration** :
   - Site URL: `http://localhost:3000`
   - Redirect URLs: `http://localhost:3000/auth/callback`

### 3. Configurer Stripe

```bash
# Installer le CLI Stripe
npm install -g stripe

# Créer les produits (exécuter une seule fois)
stripe products create --name="ResumeAI Starter"
stripe prices create \
  --product=prod_XXX \
  --unit-amount=900 \
  --currency=eur \
  --recurring[interval]=month

stripe products create --name="ResumeAI Pro"
stripe prices create \
  --product=prod_YYY \
  --unit-amount=2900 \
  --currency=eur \
  --recurring[interval]=month
```

Copie les `price_XXX` dans `.env.local` :
```env
STRIPE_PRICE_STARTER=price_xxx
STRIPE_PRICE_PRO=price_yyy
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### 4. OpenAI

1. Va sur [platform.openai.com](https://platform.openai.com)
2. API Keys → Create new secret key
3. Ajoute dans `.env.local` : `OPENAI_API_KEY=sk-...`

### 5. Lancer

```bash
npm run dev
# → http://localhost:3000
```

### 6. Tester les webhooks Stripe en local

```bash
# Dans un second terminal
stripe listen --forward-to localhost:3000/api/webhooks
# Copie le webhook secret affiché dans STRIPE_WEBHOOK_SECRET
```

---

## 🚀 Déploiement en production (Vercel)

### 1. Push sur GitHub

```bash
git init
git add .
git commit -m "feat: initial ResumeAI v1"
git remote add origin https://github.com/ton-user/resumeai.git
git push -u origin main
```

### 2. Déployer sur Vercel

```bash
npm i -g vercel
vercel --prod
```

Ou via l'interface Vercel :
1. Import Git Repository
2. Add Environment Variables (toutes les variables de `.env.local`)
3. Deploy

### 3. Configurer Stripe en production

Dans le [Dashboard Stripe](https://dashboard.stripe.com/webhooks) :
1. Add endpoint: `https://ton-domaine.vercel.app/api/webhooks`
2. Events à écouter:
   - `checkout.session.completed`
   - `invoice.paid`
   - `customer.subscription.deleted`
3. Copie le Signing secret → `STRIPE_WEBHOOK_SECRET` dans Vercel

### 4. Mettre à jour Supabase

Dans Supabase → Authentication → URL Configuration :
- Site URL: `https://ton-domaine.vercel.app`
- Redirect URLs: `https://ton-domaine.vercel.app/auth/callback`

---

## 🧪 Tests de vérification

### Test 1 — Inscription et crédits gratuits
```
1. Aller sur http://localhost:3000
2. Cliquer "Commencer gratuitement"
3. S'inscrire avec un email
4. Vérifier dans Supabase → profiles → credits_remaining = 3
```

### Test 2 — Analyse CV
```
1. Dans le dashboard, entrer:
   - Titre: "Développeur Java Senior"
   - Description: "Nous recherchons un dev Java Spring Boot, microservices, Docker..."
   - CV: coller un CV fictif
2. Cliquer "Analyser mon CV"
3. Vérifier: score ATS affiché, crédits decrementés à 2
```

### Test 3 — Paiement Stripe (test)
```
1. Cliquer "Passer Pro" → sélectionner un plan
2. Dans Stripe Checkout, utiliser: 4242 4242 4242 4242 | 12/30 | 123
3. Après succès → retour dashboard → plan mis à jour → 50 crédits
```

### Test 4 — Webhook
```bash
stripe trigger checkout.session.completed
# Vérifier dans Supabase que le plan a changé
```

### Test 5 — API directe
```bash
# Avec un token valide (récupérer depuis les cookies après connexion)
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -H "Cookie: sb-access-token=..." \
  -d '{
    "jobTitle": "Data Analyst",
    "jobDescription": "Python, SQL, Power BI requis...",
    "cvText": "Expert en Python, pandas, SQL Server...",
    "withCoverLetter": false
  }'
```

---

## 💰 Stratégie pour obtenir les 5 premiers clients

### Jour 1-2 — Validation immédiate
1. **Post LinkedIn personnel** : "J'ai construit un outil qui analyse votre CV vs offre d'emploi en 30s. Qui veut tester gratuitement ?" → DM les intéressés avec lien
2. **Groupes Facebook** "Recherche d'emploi Maroc/France/Canada" → post avec screenshot du score

### Jour 3-4 — Outreach ciblé
3. **Cold outreach LinkedIn** : 20 messages/jour à des personnes en recherche d'emploi active (profil avec "Open to work") :
   > "Bonjour [prénom], j'ai créé un outil IA qui analyse ton CV et te donne un score ATS + les mots-clés manquants pour chaque offre. Essai gratuit, pas de CB. Tu veux le lien ?"
4. **Reddit** r/jobs r/cscareerquestions r/learnprogramming → post "I built a free ATS CV analyzer, roast my product"

### Jour 5-7 — Conversion payante
5. **Offre early adopter** : Email à tous les inscrits gratuits → "Vous avez utilisé vos 3 analyses. Jusqu'à vendredi, plan Pro à 19€ au lieu de 29€ (code EARLY30)."

### Métriques cibles semaine 1
- 50 inscriptions gratuites
- 5 conversions payantes = 5 × 19€ = **95€ MRR dès la semaine 1**

---

## 🔧 Variables d'environnement complètes

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Stripe
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_STARTER=price_...
STRIPE_PRICE_PRO=price_...

# OpenAI
OPENAI_API_KEY=sk-...

# App
NEXT_PUBLIC_APP_URL=https://ton-domaine.vercel.app
```

---

## 📊 Économie du SaaS

| Plan | Prix | Crédits | Coût IA estimé* | Marge |
|------|------|---------|-----------------|-------|
| Gratuit | 0€ | 3 | ~0.06€ | — |
| Starter | 9€/mois | 10 | ~0.20€ | ~97% |
| Pro | 29€/mois | 50 | ~1.00€ | ~96% |

*GPT-4o-mini : ~0.02€ par analyse moyenne

**Break-even :** 0 (coût infra Vercel gratuit + Supabase gratuit jusqu'à 500MB)

---

Construit avec ❤️ pour être lancé en < 48h.
# resumeai-v1
