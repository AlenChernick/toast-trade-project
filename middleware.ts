import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/services/auth.service';
import { ApiRoutes, AppRoutes } from '@/enum';

const allowedOrigins = [
  'http://localhost:3000',
  'https://localhost:3000',
  'http://10.0.0.1:3000',
  'https://checkout.stripe.com',
  'https://hooks.stripe.com',
];

const corsOptions = {
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

const protectedRoutes: AppRoutes[] = [AppRoutes.Dashboard];
const publicRoutes: AppRoutes[] = [
  AppRoutes.Home,
  AppRoutes.SignIn,
  AppRoutes.SignUp,
];

export async function middleware(request: NextRequest) {
  const isDev = process.env.NODE_ENV === 'development';
  const path = request.nextUrl.pathname as AppRoutes;
  const method = request.method;
  const origin = isDev
    ? 'https://localhost:3000' || 'http://localhost:3000'
    : request.headers.get('origin') ?? '';

  const isProtectedRoute = protectedRoutes.some((route) =>
    path.startsWith(route)
  );

  const isPublicRoute = publicRoutes.includes(path);

  const isAuthPages =
    path.startsWith(AppRoutes.SignIn) || path.startsWith(AppRoutes.SignUp);

  const loggedInUser = await authService.getLoggedInUser();
  const userId = loggedInUser?._id;

  if (isProtectedRoute && !userId) {
    return NextResponse.redirect(new URL(AppRoutes.SignIn, request.nextUrl));
  }

  if (isAuthPages && loggedInUser) {
    return NextResponse.redirect(new URL(AppRoutes.Home, request.nextUrl));
  }

  if (isPublicRoute) {
    return NextResponse.next();
  }

  if (path.startsWith(ApiRoutes.Api)) {
    const isAllowedOrigin = allowedOrigins.includes(origin);

    const isPreflight = method === 'OPTIONS';

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
