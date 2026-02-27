import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /, /login, /profile)
  const { pathname } = request.nextUrl;

  // Define public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/login',
    '/api/auth/send-otp',
    '/api/auth/verify-otp',
    '/api/auth/verify-mpin',
    '/api/auth/resend-otp',
    '/api',
    '/news',
    '/videos',
    '/category',
    '/search',
    '/epaper',
    '/rashifal',
    '/podcast',
    '/webstory',
    '/getjournalist',
    '/addjournalist',
    '/journalist',
    '/journalistdetails',
    '/campuscorner',
    '/getcampuscorner',
    '/addcampuscorner',
    '/campuscornerdetails',
    '/payment',
  ];

  // Check if the current path is a public route or starts with a public route
  const isPublicRoute = publicRoutes.some(route => {
    if (route === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(route);
  });

  // If it's a public route, allow access
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // For protected routes, check authentication on client side
  // Since we can't access localStorage in middleware, we'll handle this in the component
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    // '/((?!_next/static|_next/image|favicon.ico|public|assets).*)',
    '/((?!_next/static|_next/image|public|assets).*)',
  ],
};
