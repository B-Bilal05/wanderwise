import Groq from "groq-sdk";
import { NextResponse } from "next/server";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  const { city, days, budget, interests, level } = await req.json();

  const prompt = `Travel planner: Generate a ${days}-day itinerary for ${city}.
Budget: ${level} (~$${budget}/day). Interests: ${interests.join(', ')}.
CRITICAL: Return ONLY valid compact JSON. No markdown. Keep ALL strings SHORT (max 80 chars).

{"city":"${city}","days":${days},"totalEstimated":0,"weatherAdvice":"Short tip under 60 chars","itinerary":[{"day":1,"title":"Short title","theme":"Theme","activities":[{"time":"09:00","place":"Name","description":"One short sentence.","duration":"2h","cost":0,"category":"Museum","tip":"Short tip.","lat":0.0,"lng":0.0}],"budgetBreakdown":{"food":0,"transport":0,"activities":0,"total":0}}]}

Rules:
- Exactly ${days} days in itinerary array
- Exactly 4 activities per day
- ALL strings under 80 characters
- Real GPS coordinates for ${city}
- All costs as integers in USD`;

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 6000,
      temperature: 0.3,
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
