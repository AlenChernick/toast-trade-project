import { NextResponse } from 'next/server';
import { User, type UserType, type JwtUser } from '@/models/user.model';
import bcrypt from 'bcrypt';
import connectDB from '@/services/db.service';
import { createSession, signOut } from '@/services/auth.service';
import { use } from 'react';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    await connectDB();

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

    const user: JwtUser = {
      _id: existingUser._id,
      username: existingUser.username,
      firstName: existingUser.firstName,
      lastName: existingUser.lastName,
      email: existingUser.email,
      createdAt: existingUser.createdAt,
      updatedAt: existingUser.updatedAt,
    };

    await createSession({
      ...user,
    });

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.log('[POST:SIGN-IN]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await signOut();
    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.log('[DELETE:SIGN-IN]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
