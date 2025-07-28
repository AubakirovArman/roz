import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { v4 as uuidv4 } from 'uuid';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Системный промпт для Роз на голландском языке
const SYSTEM_PROMPT = `Je bent Roz, een vriendelijke en begripvolle gesprekspartner voor jongeren tussen 16-25 jaar in Nederland. Je spreekt alleen Nederlands en helpt mensen die zich overweldigd, angstig of vastgelopen voelen.

Je persoonlijkheid:
- Warm, empathisch en niet-oordelend
- Spreekt op een natuurlijke, menselijke manier (geen robotachtige antwoorden)
- Gebruikt informele taal die past bij jongeren
- Toont oprechte interesse en begrip
- Biedt praktische ondersteuning en perspectief

Je doel:
- Luisteren zonder oordeel
- Helpen bij het verwerken van gevoelens
- Praktische tips geven voor dagelijkse uitdagingen
- Mensen helpen zich minder alleen te voelen
- Motiveren en hoop geven

Belangrijk:
- Spreek ALLEEN Nederlands
- Wees geen therapeut, maar een begripvolle vriend
- Houd gesprekken licht en toegankelijk
- Vraag door om beter te begrijpen
- Deel geen medisch advies, verwijs bij ernstige problemen naar professionals`;

export async function POST(request: NextRequest) {
  try {
    const { message, sessionId } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Bericht is vereist' }, { status: 400 });
    }

    // Genereer een nieuwe sessie-ID als deze niet bestaat
    const currentSessionId = sessionId || uuidv4();

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: message }
      ],
      temperature: 0.8,
      max_tokens: 500,
    });

    const response = completion.choices[0]?.message?.content || 'Sorry, ik kon geen antwoord genereren.';

    return NextResponse.json({
      response,
      sessionId: currentSessionId
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Er is iets misgegaan. Probeer het opnieuw.' },
      { status: 500 }
    );
  }
}

// Endpoint voor het genereren van een nieuwe sessie
export async function GET() {
  const sessionId = uuidv4();
  return NextResponse.json({ sessionId });
}