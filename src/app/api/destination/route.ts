import Groq from "groq-sdk";
import { NextResponse } from "next/server";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  const { destination, lang = 'English' } = await req.json();

  const prompt = `You are an expert travel writer. Write rich, detailed travel content in ${lang} for: "${destination}".
Return ONLY a valid JSON object. No markdown, no backticks, no trailing commas.

Content rules:
- overview: 4-5 sentences about atmosphere, history, culture, uniqueness.
- places descriptions: 2-3 sentences with history, what to see, practical tips.
- tips: 2-3 sentences each, concrete and actionable with specific details.
- aiAdvice: 4-5 sentences of insider tips with specific neighborhood names, restaurants, hidden gems.
- ALL text content must be written in ${lang}.

{
  "city": "city name",
  "country": "country name",
  "flag": "🇲🇦",
  "currency": "MAD (Dh)",
  "language": "Arabic, French",
  "timezone": "UTC+1",
  "bestSeason": "...",
  "overview": "...",
  "safetyLevel": "Safe / Generally Safe / Use Caution",
  "visaInfo": "...",
  "cityLat": 0.0,
  "cityLng": 0.0,
  "places": [
    {"name":"...","description":"...","category":"...","entryFee":"...","duration":"...","lat":0.0,"lng":0.0}
  ],
  "budget": {
    "budget": {"daily":0,"hotel":0,"food":0,"transport":0},
    "mid":    {"daily":0,"hotel":0,"food":0,"transport":0},
    "luxury": {"daily":0,"hotel":0,"food":0,"transport":0}
  },
  "tips": [
    {"type":"info","title":"...","text":"..."},
    {"type":"warn","title":"...","text":"..."},
    {"type":"ok","title":"...","text":"..."},
    {"type":"info","title":"...","text":"..."}
  ],
  "aiAdvice": "..."
}
5 places, 4 tips, all budget numbers as integers in USD. ALL content in ${lang}.`;

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 3000,
      temperature: 0.4,
    });

    let text = completion.choices[0].message.content!
      .replace(/```json|```/g, "")
      .replace(/[\u0000-\u001F\u007F]/g, " ")
      .trim();

    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start !== -1 && end !== -1) text = text.slice(start, end + 1);

    return NextResponse.json(JSON.parse(text));
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
