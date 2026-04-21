import OpenAI from "openai";
import { ATSResult } from "@/types";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function analyzeCV(
  cvText: string,
  jobTitle: string,
  jobDescription: string,
  includeCoverLetter: boolean = false
): Promise<ATSResult> {
  const prompt = `Tu es un expert en recrutement et en systèmes ATS (Applicant Tracking System).

Analyse ce CV par rapport à cette offre d'emploi et retourne un JSON structuré.

OFFRE D'EMPLOI:
Titre: ${jobTitle}
Description: ${jobDescription}

CV:
${cvText}

Retourne UNIQUEMENT un JSON valide avec cette structure exacte:
{
  "ats_score": <nombre entre 0 et 100>,
  "missing_keywords": [<liste des mots-clés importants absents du CV>],
  "strengths": [<liste des points forts du candidat pour ce poste>],
  "weaknesses": [<liste des points faibles ou manques>],
  "suggestions": [<liste de suggestions concrètes pour améliorer le CV>]${includeCoverLetter ? `,
  "cover_letter": "<lettre de motivation professionnelle de 3 paragraphes en français>"` : ""}
}

Sois précis, actionnable et professionnel. Score ATS basé sur: mots-clés (40%), expérience (30%), compétences (20%), format (10%).`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
    temperature: 0.3,
  });

  const result = JSON.parse(response.choices[0].message.content || "{}");
  return result as ATSResult;
}
