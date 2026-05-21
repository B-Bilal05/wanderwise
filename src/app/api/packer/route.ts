import Groq from "groq-sdk";
import { NextResponse } from "next/server";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  const { city, country, days, weather, temp, season, activities, budgetLevel, gender } = await req.json();

  const prompt = `Tu es un expert en préparation de voyage.
Destination : ${city} (${country}), saison : ${season}, météo : ${weather}, température : ${temp}°C.
Durée : ${days} jours. Activités : ${activities}. Niveau : ${budgetLevel}. Genre : ${gender}.

Retourne UNIQUEMENT un JSON valide compact, strings courtes:
{"categories":[{"name":"Vêtements","icon":"👕","items":["item1","item2"]},{"name":"Toilette","icon":"🧴","items":[]},{"name":"Électronique","icon":"🔌","items":[]},{"name":"Santé","icon":"💊","items":[]},{"name":"Documents","icon":"📄","items":[]},{"name":"Divers","icon":"🎒","items":[]}],"tips":["tip1","tip2","tip3"]}

Règles: 6-10 items par catégorie, items concrets et courts (max 30 chars), 3-4 tips utiles.`;

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1000,
      temperature: 0.3,
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
