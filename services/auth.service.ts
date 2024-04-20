import 'server-only';
import jwt from 'jsonwebtoken';
import type { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies';
import type { CurrentUser } from '@/models/user.model';
import { cookies } from 'next/headers';

const secretKey: string = process.env.JWT_SECRET_KEY as string;

const getTokenFromCookie: () => Promise<RequestCookie | null> = async () => {
  return cookies().get('session-toast-trade') || null;
};

export const generateToken = (payload: string | object | Buffer): string => {
  return jwt.sign(payload, secretKey, { expiresIn: '1h', algorithm: 'HS256' });
};

export const setTokenInCookie = async (token: string) => {
  const isSecure = process.env.NODE_ENV === 'production';

  cookies().set('session-toast-trade', token, {
    secure: isSecure,
    httpOnly: true,
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60,
  });
};

export const getCurrentUser: () => Promise<CurrentUser | null> = async () => {
  const tokenCookie = await getTokenFromCookie();

  if (tokenCookie && typeof tokenCookie.value === 'string') {
    const token = tokenCookie.value;

    try {
      const decoded = jwt.verify(token, secretKey, { algorithms: ['HS256'] });
      return decoded as CurrentUser;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  } else {
    console.error('Token is not found or not a string:', tokenCookie);
    return null;
  }
};

export const signOut: () => Promise<void> = async () => {
  cookies().delete('session-toast-trade');
};
