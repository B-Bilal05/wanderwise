import Groq from "groq-sdk";
import { NextResponse } from "next/server";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  const { data, targetLang, targetLangName } = await req.json();

  const prompt = `Translate the following travel data fields to ${targetLangName}.
Translate ONLY these text fields: overview, aiAdvice, visaInfo, bestSeason, safetyLevel, places descriptions, tips titles and texts.
Keep: city name, country name, flag, currency, numbers, GPS coordinates, category names UNCHANGED.
Return ONLY raw JSON with the exact same structure, no markdown.

Data to translate:
${JSON.stringify(data)}`;

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 2000,
      temperature: 0.1,
    });
    const text = completion.choices[0].message.content!.replace(/```json|```/g, "").trim();
    return NextResponse.json(JSON.parse(text));
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
