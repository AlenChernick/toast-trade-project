import { NextResponse } from 'next/server';
import { User, UserType } from '@/models/user.model';
import bcrypt from 'bcrypt';
import connectDB from '@/services/db.service';
import { generateToken, setTokenInCookie } from '@/services/auth.service';

export async function POST(req: Request) {
  try {
    await connectDB();

    const { username, password } = await req.json();

    const existingUser: UserType | null = await User.findOne({ username });

    if (!existingUser) {
      return new NextResponse('Username not found', { status: 404 });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordValid) {
      return new NextResponse('Invalid password', { status: 401 });
    }

    const user: Omit<UserType, 'password'> & { password?: string } = {
      _id: existingUser._id,
      username: existingUser.username,
      firstName: existingUser.firstName,
      lastName: existingUser.lastName,
      birthday: existingUser.birthday,
      email: existingUser.email,
      createdAt: existingUser.createdAt,
      updatedAt: existingUser.updatedAt,
    };

    const token = generateToken({ ...user });

    setTokenInCookie(token);

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.log('[POST:SIGN-IN]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
