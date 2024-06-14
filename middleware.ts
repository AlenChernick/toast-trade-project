import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/services/auth.service';

const allowedOrigins = ['http://localhost:3000', 'http://10.0.0.1:3000'];

const corsOptions = {
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

const protectedRoutes = ['/dashboard'];
const publicRoutes = ['/sign-in', '/sign-up', '/'];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const isProtectedRoute = protectedRoutes.some((route) =>
    path.startsWith(route)
  );

  const isPublicRoute = publicRoutes.includes(path);

  const isAuthPages =
    path.startsWith('/sign-in') || path.startsWith('/sign-up');

  const loggedInUser = await authService.getLoggedInUser();
  const userId = loggedInUser?._id;

  if (isProtectedRoute && !userId) {
    return NextResponse.redirect(new URL('/sign-in', request.nextUrl));
  }

  if (isAuthPages && loggedInUser) {
    return NextResponse.redirect(new URL('/', request.nextUrl));
  }

  if (isPublicRoute) {
    return NextResponse.next();
  }

  if (path.startsWith('/api')) {
    const origin = request.headers.get('origin') ?? '';
    const isAllowedOrigin = allowedOrigins.includes(origin);

    const isPreflight = request.method === 'OPTIONS';

    if (isPreflight) {
      const preflightHeaders = {
        ...(isAllowedOrigin && { 'Access-Control-Allow-Origin': origin }),
        ...corsOptions,
      };
      return NextResponse.json({}, { headers: preflightHeaders });
    }

    const response = NextResponse.next();

    if (isAllowedOrigin) {
      response.headers.set('Access-Control-Allow-Origin', origin);
    } else {
      return new NextResponse('Forbidden - Unauthorized', { status: 403 });
    }

    Object.entries(corsOptions).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|.*\\.png$).*)'],
};
