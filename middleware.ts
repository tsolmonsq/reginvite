// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  const isPublicRoute = request.nextUrl.pathname === '/';

  // Хэрвээ public route руу орсон ба token байгаа бол → dashboard руу чиглүүлнэ
  if (token && isPublicRoute) {
    return NextResponse.redirect(new URL('/events', request.url));
  }

  // Хэрвээ protected route руу орсон ба token байхгүй бол → landing руу буцаана
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/events');
  if (!token && isProtectedRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/events/:path*'], // public + protected route-уудыг л шалгана
};
