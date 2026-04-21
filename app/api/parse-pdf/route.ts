import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "Aucun fichier fourni." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Dynamic import to avoid build issues
    const pdfParse = (await import("pdf-parse" as any)).default;
    const data = await pdfParse(buffer);

    const cleanText = data.text
      .replace(/\n{3,}/g, "\n\n")
      .replace(/\s{3,}/g, " ")
      .trim();

    return NextResponse.json({ text: cleanText, pages: data.numpages });
  } catch (err) {
    console.error("PDF parse error:", err);
    return NextResponse.json({ error: "Erreur lors de la lecture du PDF." }, { status: 500 });
  }
}
