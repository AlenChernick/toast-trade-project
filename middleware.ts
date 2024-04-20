import { NextRequest, NextResponse } from 'next/server';
import { getLoggedInUser } from '@/services/auth.service';

const allowedOrigins = ['http://localhost:3000'];

const corsOptions = {
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function middleware(request: NextRequest) {
  const loggedInUser = await getLoggedInUser();
  const userId = loggedInUser?._id;
  const isHomePage = request.nextUrl.pathname === '/';
  const isSignInPage = request.nextUrl.pathname === '/sign-in';
  const isSignUpPage = request.nextUrl.pathname === '/sign-up';

  if (!userId && isHomePage) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  if (userId && (isSignInPage || isSignUpPage)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (request.nextUrl.pathname.startsWith('/api')) {
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
  matcher: ['/', '/sign-in', '/sign-up', '/api/:path*'],
};
