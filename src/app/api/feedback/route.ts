import { NextRequest, NextResponse } from 'next/server';
import { writeFile, readFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

interface Feedback {
  sessionId: string;
  rating: number;
  comment?: string;
  timestamp: string;
}

const FEEDBACK_DIR = path.join(process.cwd(), 'data');
const FEEDBACK_FILE = path.join(FEEDBACK_DIR, 'feedback.json');

async function ensureDataDir() {
  if (!existsSync(FEEDBACK_DIR)) {
    await mkdir(FEEDBACK_DIR, { recursive: true });
  }
}

async function readFeedback(): Promise<Feedback[]> {
  try {
    await ensureDataDir();
    if (!existsSync(FEEDBACK_FILE)) {
      return [];
    }
    const data = await readFile(FEEDBACK_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading feedback:', error);
    return [];
  }
}

async function writeFeedback(feedback: Feedback[]) {
  try {
    await ensureDataDir();
    await writeFile(FEEDBACK_FILE, JSON.stringify(feedback, null, 2));
  } catch (error) {
    console.error('Error writing feedback:', error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { sessionId, rating, comment } = await request.json();

    if (!sessionId || !rating) {
      return NextResponse.json(
        { error: 'Sessie-ID en beoordeling zijn vereist' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Beoordeling moet tussen 1 en 5 zijn' },
        { status: 400 }
      );
    }

    const newFeedback: Feedback = {
      sessionId,
      rating,
      comment: comment || '',
      timestamp: new Date().toISOString(),
    };

    const existingFeedback = await readFeedback();
    existingFeedback.push(newFeedback);
    await writeFeedback(existingFeedback);

    return NextResponse.json({ success: true, message: 'Bedankt voor je feedback!' });

  } catch (error) {
    console.error('Feedback API error:', error);
    return NextResponse.json(
      { error: 'Er is iets misgegaan bij het opslaan van je feedback.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const feedback = await readFeedback();
    return NextResponse.json({ feedback });
  } catch (error) {
    console.error('Error fetching feedback:', error);
    return NextResponse.json(
      { error: 'Er is iets misgegaan bij het ophalen van feedback.' },
      { status: 500 }
    );
  }
}