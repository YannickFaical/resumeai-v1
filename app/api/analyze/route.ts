import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { analyzeCV } from "@/lib/openai";

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
    }

    // Get user profile with credits
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: "Profil introuvable." }, { status: 404 });
    }

    if (profile.credits_remaining <= 0) {
      return NextResponse.json(
        { error: "Crédits insuffisants. Passez à un plan payant." },
        { status: 402 }
      );
    }

    const body = await req.json();
    const { jobTitle, jobDescription, cvText, withCoverLetter } = body;

    if (!jobTitle || !jobDescription || !cvText) {
      return NextResponse.json(
        { error: "Titre, description et CV sont requis." },
        { status: 400 }
      );
    }

    // Can only generate cover letter on paid plans
    const canCoverLetter = profile.plan === "pro" || profile.plan === "starter";
    const includeCoverLetter = withCoverLetter && canCoverLetter;

    // Call OpenAI
    const result = await analyzeCV(cvText, jobTitle, jobDescription, includeCoverLetter);

    // Save analysis to DB
    const { data: analysis, error: analysisError } = await supabase
      .from("analyses")
      .insert({
        user_id: user.id,
        job_title: jobTitle,
        job_description: jobDescription,
        cv_text: cvText,
        ats_score: result.ats_score,
        missing_keywords: result.missing_keywords,
        strengths: result.strengths,
        weaknesses: result.weaknesses,
        suggestions: result.suggestions,
        cover_letter: result.cover_letter || null,
      })
      .select()
      .single();

    if (analysisError) {
      console.error("DB insert error:", analysisError);
      return NextResponse.json({ error: "Erreur lors de la sauvegarde." }, { status: 500 });
    }

    // Decrement credits
    await supabase
      .from("profiles")
      .update({ credits_remaining: profile.credits_remaining - 1 })
      .eq("id", user.id);

    return NextResponse.json({ analysis });
  } catch (err) {
    console.error("Analyze error:", err);
    return NextResponse.json({ error: "Erreur serveur inattendue." }, { status: 500 });
  }
}
