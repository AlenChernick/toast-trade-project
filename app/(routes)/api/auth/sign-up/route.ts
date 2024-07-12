import { NextResponse } from 'next/server';
import { User, UserType } from '@/models/user.model';
import bcrypt from 'bcrypt';
import connectDB from '@/services/db.service';

export async function POST(req: Request) {
  try {
    const { username, firstName, lastName, email, birthday, password } =
      await req.json();

    if (
      !username ||
      !firstName ||
      !lastName ||
      !email ||
      !birthday ||
      !password
    ) {
      return new NextResponse('Missing parameters', { status: 400 });
    }

    await connectDB();

    const existingUsername: UserType | null = await User.findOne({ username });

    if (existingUsername) {
      return new NextResponse('Username already exists', { status: 400 });
    }

    const existingEmail: UserType | null = await User.findOne({ email });

    if (existingEmail) {
      return new NextResponse('Email already exists', { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 14);

    const newUser = new User({
      username,
      firstName,
      lastName,
      email,
      password: hashedPassword,
      birthday,
    });

    await newUser.save();
    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.log('[POST:SIGN-UP]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
