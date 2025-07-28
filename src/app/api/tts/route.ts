import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { text, voice = 'alloy', model = 'tts-1' } = await request.json();

    if (!text) {
      return NextResponse.json({ error: 'Tekst is vereist' }, { status: 400 });
    }

    // Valideer voice parameter
    const validVoices = ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'];
    if (!validVoices.includes(voice)) {
      return NextResponse.json({ error: 'Ongeldige stem' }, { status: 400 });
    }

    // Valideer model parameter - только существующие модели OpenAI
    const validModels = ['tts-1', 'tts-1-hd', 'gpt-4o-mini-tts'];
    if (!validModels.includes(model)) {
      return NextResponse.json({ error: 'Ongeldig model' }, { status: 400 });
    }

    const mp3 = await openai.audio.speech.create({
      model: model as 'tts-1' | 'tts-1-hd' | 'gpt-4o-mini-tts',
      voice: voice as 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer',
      input: text,
      response_format: 'mp3',
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': buffer.length.toString(),
      },
    });

  } catch (error) {
    console.error('TTS API error:', error);
    return NextResponse.json(
      { error: 'Er is iets misgegaan bij het genereren van audio.' },
      { status: 500 }
    );
  }
}