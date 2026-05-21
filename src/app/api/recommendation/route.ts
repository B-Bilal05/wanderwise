import Groq from "groq-sdk";
import { NextResponse } from "next/server";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  const { history } = await req.json();

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `Tu es WanderWise, un assistant de voyage expert et passionné.
Tu aides les utilisateurs à choisir leur prochaine destination de voyage.
Tu poses des questions sur leur budget, la saison, leurs centres d'intérêt et leur niveau de confort.
Tu proposes des destinations précises avec des arguments convaincants.
Tu donnes des estimations de budget, les meilleures périodes et des conseils pratiques.
Tu réponds toujours en français de manière chaleureuse et enthousiaste.
Tu utilises des emojis pour rendre tes réponses plus vivantes.`,
        },
        ...history.map((msg: { role: string; content: string }) => ({
          role: msg.role as "user" | "assistant",
          content: msg.content,
        })),
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    const reply = completion.choices[0].message.content || "Je n'ai pas pu générer de réponse.";
    return NextResponse.json({ reply });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur serveur. Réessaie." }, { status: 500 });
  }
}
