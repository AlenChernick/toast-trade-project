import 'server-only';
import { JWTPayload, SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const secretKey: string = process.env.JWT_SECRET_KEY as string;
const encodedKey = new TextEncoder().encode(secretKey);
const isSecure = process.env.NODE_ENV === 'production';
const expiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000);
const cookieSessionKey = 'session-toast-trade';

const cookieOptions = {
  httpOnly: true,
  secure: isSecure,
  expires: expiresAt,
  sameSite: 'strict' as const,
  path: '/',
};

const encrypt = async (payload: JWTPayload | undefined) => {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(encodedKey);
};

const createSession = async (user: JWTPayload | undefined) => {
  const session = await encrypt({ ...user, expiresAt });

  cookies().set(cookieSessionKey, session, cookieOptions);
};

const updateSession = async () => {
  const session = cookies().get(cookieSessionKey)?.value;
  const payload = await decrypt(session);

  if (!session || !payload) {
    return null;
  }

  cookies().set(cookieSessionKey, session, cookieOptions);
};

const getLoggedInUser = async () => {
  const cookie = cookies().get(cookieSessionKey)?.value;
  const loggedInUser = await decrypt(cookie);
  return loggedInUser;
};

const decrypt = async (session: string | undefined = '') => {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (error) {
    console.log('Failed to verify session');
  }
};

const signOut = async () => {
  cookies().delete(cookieSessionKey);
};

export const authService = {
  createSession,
  updateSession,
  getLoggedInUser,
  signOut,
};
