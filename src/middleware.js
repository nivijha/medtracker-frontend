import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // Define protected and public routes
  const isProtectedRoute = pathname.startsWith('/dashboard') || 
                           pathname.startsWith('/appointments') || 
                           pathname.startsWith('/medications') || 
                           pathname.startsWith('/reports') || 
                           pathname.startsWith('/profile');
  const isPublicRoute = pathname === '/login' || pathname === '/';

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isPublicRoute && token && pathname !== '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*', 
    '/appointments/:path*', 
    '/medications/:path*', 
    '/reports/:path*', 
    '/profile/:path*', 
    '/login'
  ],
};
