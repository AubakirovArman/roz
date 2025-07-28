import { NextResponse } from 'next/server';

// Фиксированный токен для доступа к чату
const CHAT_ACCESS_TOKEN = process.env.CHAT_ACCESS_TOKEN || 'roz-chat-2024';

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Token is vereist' },
        { status: 400 }
      );
    }

    // Controleer of de token overeenkomt
    if (token === CHAT_ACCESS_TOKEN) {
      return NextResponse.json(
        { success: true, message: 'Toegang verleend' },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: 'Ongeldig toegangstoken' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { error: 'Server fout' },
      { status: 500 }
    );
  }
}

// GET endpoint om de huidige auth status te controleren
export async function GET(request: Request) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '');
  
  if (token === CHAT_ACCESS_TOKEN) {
    return NextResponse.json({ authenticated: true });
  }
  
  return NextResponse.json({ authenticated: false }, { status: 401 });
}