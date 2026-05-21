import Groq from "groq-sdk";
import { NextResponse } from "next/server";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  const { departure, destination, budget, days, flightClass, accommodation, foodStyle, transport } = await req.json();

  const prompt = `You are a travel budget expert. Calculate a detailed budget for a trip from "${departure}" to "${destination}" for ${days} days, budget $${budget} USD.

Preferences:
- Flight class: ${flightClass} (Economy / Business / First Class)
- Accommodation: ${accommodation} (Hostel / Budget Hotel / Mid-range Hotel / Luxury Hotel / Airbnb)
- Food style: ${foodStyle} (Street food / Local restaurants / Mid-range / Fine dining)
- Local transport: ${transport} (Public transport / Taxi/Uber / Car rental / Walking)

Return ONLY raw JSON, no markdown:
{
  "destination": "${destination}",
  "departure": "${departure}",
  "flag": "emoji",
  "totalBudget": ${budget},
  "days": ${days},
  "currency": "local currency",
  "flight": {
    "economy": 0, "business": 0, "firstClass": 0,
    "selected": 0,
    "selectedClass": "${flightClass}",
    "tip": "conseil en français"
  },
  "accommodation": {
    "hostel": 0, "budgetHotel": 0, "midHotel": 0, "luxuryHotel": 0, "airbnb": 0,
    "selected": 0,
    "selectedType": "${accommodation}",
    "totalStay": 0
  },
  "food": {
    "streetFood": 0, "localRestaurant": 0, "midRange": 0, "fineDining": 0,
    "selected": 0,
    "selectedStyle": "${foodStyle}",
    "total": 0,
    "breakdown": [
      {"meal": "Petit-déjeuner", "price": 0},
      {"meal": "Déjeuner", "price": 0},
      {"meal": "Dîner", "price": 0},
      {"meal": "Snacks/Café", "price": 0}
    ]
  },
  "transport": {
    "publicTransport": 0, "taxiUber": 0, "carRental": 0, "walking": 0,
    "selected": 0,
    "selectedMode": "${transport}",
    "total": 0,
    "tips": "conseil en français"
  },
  "activities": {
    "daily": 0, "total": 0,
    "mustSee": [
      {"name": "lieu", "price": 0},
      {"name": "lieu", "price": 0},
      {"name": "lieu", "price": 0},
      {"name": "lieu", "price": 0}
    ]
  },
  "misc": { "daily": 0, "total": 0, "includes": "souvenirs, urgences..." },
  "summary": {
    "totalEstimated": 0,
    "remaining": 0,
    "isEnough": true,
    "verdict": "phrase en français",
    "savingTips": ["conseil 1", "conseil 2", "conseil 3"]
  }
}
All amounts USD integers. remaining = totalBudget - totalEstimated. isEnough = remaining >= 0. Flag emoji only.`;

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1800,
      temperature: 0.2,
    });
    const text = completion.choices[0].message.content!.replace(/```json|```/g, "").trim();
    return NextResponse.json(JSON.parse(text));
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
