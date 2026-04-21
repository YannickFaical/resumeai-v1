"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, signUp } from "./actions";
import toast from "react-hot-toast";
import { FileText, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "signup") {
        const result = await signUp(email, password, fullName);
        if (result?.error) throw new Error(result.error);
        toast.success("Compte créé ! Vérifiez votre email.");
        window.location.href = "/dashboard";
      } else {
        const result = await signIn(email, password);
        if (result?.error) throw new Error(result.error);
        window.location.href = "/dashboard";
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Une erreur est survenue";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-paper">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 mb-10 justify-center">
          <div className="w-8 h-8 bg-ink rounded-lg flex items-center justify-center">
            <FileText className="w-4 h-4 text-paper" />
          </div>
          <span className="font-display font-bold text-lg">ResumeAI</span>
        </Link>

        <div className="card border-ink/12 shadow-xl">
          <h1 className="font-display text-2xl font-bold mb-1">
            {mode === "signup" ? "Commencer gratuitement" : "Bon retour 👋"}
          </h1>
          <p className="text-sm text-muted font-body mb-8">
            {mode === "signup"
              ? "3 analyses offertes, sans carte bancaire."
              : "Connectez-vous à votre compte."}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className="text-xs font-display font-semibold text-muted uppercase tracking-wide block mb-1.5">
                  Nom complet
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ex: Sophie Martin"
                  className="input-field"
                  required
                />
              </div>
            )}

            <div>
              <label className="text-xs font-display font-semibold text-muted uppercase tracking-wide block mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vous@email.com"
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="text-xs font-display font-semibold text-muted uppercase tracking-wide block mb-1.5">
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="8 caractères minimum"
                className="input-field"
                minLength={8}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-accent w-full justify-center mt-6"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  {mode === "signup" ? "Créer mon compte" : "Se connecter"}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-ink/8 text-center">
            <button
              onClick={() => setMode(mode === "signup" ? "login" : "signup")}
              className="text-sm text-muted hover:text-ink transition-colors font-body"
            >
              {mode === "signup"
                ? "Déjà un compte ? Se connecter"
                : "Pas de compte ? S'inscrire gratuitement"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
