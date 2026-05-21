import Groq from "groq-sdk";
import { NextResponse } from "next/server";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  const { city1, city2 } = await req.json();

  const prompt = `You are a travel expert API. Compare: "${city1}" vs "${city2}".
Return ONLY raw JSON, no markdown, no backticks.

CRITICAL: "flag" field MUST be a single emoji character like 🇮🇹 🇪🇸 🇲🇦 🇯🇵 — NOT a URL or image path.

{
  "city1": {
    "name": "Rome", "country": "Italy", "flag": "🇮🇹",
    "currency": "EUR (€)", "language": "Italian", "safety": "Safe",
    "bestSeason": "April–June", "budgetPerDay": 120,
    "highlights": ["Colosseum", "Vatican", "Trevi Fountain"],
    "pros": ["Rich history", "Amazing food", "Great transport"],
    "cons": ["Crowded in summer", "Expensive in center"],
    "idealFor": "Culture & history lovers", "rating": 9
  },
  "city2": {
    "name": "...", "country": "...", "flag": "🇪🇸",
    "currency": "...", "language": "...", "safety": "...",
    "bestSeason": "...", "budgetPerDay": 0,
    "highlights": ["...", "...", "..."],
    "pros": ["...", "...", "..."],
    "cons": ["...", "..."],
    "idealFor": "...", "rating": 0
  },
  "verdict": {
    "winner": "city name",
    "reason": "2-3 sentences in French explaining which is better and why",
    "budgetWinner": "city name",
    "safetyWinner": "city name",
    "cultureWinner": "city name"
  }
}
Rules: budgetPerDay as integer USD, rating out of 10 as integer, exactly 3 highlights, 3 pros, 2 cons. Flag MUST be emoji only.`;

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1500,
      temperature: 0.3,
    });

    const text = completion.choices[0].message.content!
      .replace(/```json|```/g, "").trim();

    const data = JSON.parse(text);

    // Sécurité : si le flag est une URL, on met un emoji générique
    const cleanFlag = (flag: string) =>
      flag.startsWith('http') || flag.includes('/') ? '🏳️' : flag;

    data.city1.flag = cleanFlag(data.city1.flag);
    data.city2.flag = cleanFlag(data.city2.flag);

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
