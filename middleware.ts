// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  const isPublic = request.nextUrl.pathname === '/';
  const isProtected = request.nextUrl.pathname.startsWith('/events');

  if (token && isPublic) {
    return NextResponse.redirect(new URL('/events', request.url));
  }

  if (!token && isProtected) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/events/:path*'],
};
