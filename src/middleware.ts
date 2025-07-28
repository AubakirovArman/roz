import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Фиксированный токен для доступа к чату
const CHAT_ACCESS_TOKEN = process.env.CHAT_ACCESS_TOKEN || 'roz-chat-2024';

export function middleware(request: NextRequest) {
  // Проверяем только главную страницу чата
  if (request.nextUrl.pathname === '/') {
    const token = request.cookies.get('chat_token')?.value;
    
    // Если токен отсутствует или неверный, перенаправляем на страницу входа
    if (!token || token !== CHAT_ACCESS_TOKEN) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  
  // Если пользователь уже авторизован и пытается зайти на страницу входа
  if (request.nextUrl.pathname === '/login') {
    const token = request.cookies.get('chat_token')?.value;
    
    if (token === CHAT_ACCESS_TOKEN) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/login']
};