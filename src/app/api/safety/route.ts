import Groq from "groq-sdk";
import { NextResponse } from "next/server";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  const { city, country, season, activities } = await req.json();

  const prompt = `Tu es un expert en sécurité et santé voyage.
Pour ${city}, ${country}, en ${season}, activités: ${activities}.
Retourne UNIQUEMENT un JSON valide compact, strings courtes (max 80 chars):
{"riskLevel":"faible","riskColor":"#4ade80","healthAdvice":["conseil1","conseil2","conseil3","conseil4","conseil5"],"securityAdvice":["conseil1","conseil2","conseil3","conseil4"],"emergencyNumbers":{"police":"...","ambulance":"...","pompiers":"...","urgences":"..."},"specificRisks":["risque1","risque2","risque3"],"localCustoms":["coutume1","coutume2","coutume3","coutume4"],"waterSafe":true,"vaccinesRequired":["vaccin1","vaccin2"]}
riskLevel doit être exactement "faible", "moyen" ou "élevé".
riskColor: "#4ade80" pour faible, "#f59e0b" pour moyen, "#f87171" pour élevé.
Toutes les infos doivent être spécifiques à ${city}, ${country}.`;

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 800,
      temperature: 0.2,
    });

    let text = completion.choices[0].message.content!
      .replace(/```json|```/g, "").trim();
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start !== -1 && end !== -1) text = text.slice(start, end + 1);

    return NextResponse.json(JSON.parse(text));
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
