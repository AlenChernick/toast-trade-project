import { User, type UserType } from '@/models/user.model';
import { NextResponse } from 'next/server';
import { authService } from '@/services/auth.service';
import bcrypt from 'bcrypt';
import connectDB from '@/services/db.service';

export async function PATCH(req: Request) {
  try {
    const { userId, firstName, lastName, email, password } = await req.json();
    const loggedInUser = await authService.getLoggedInUser();

    if (loggedInUser?._id != userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    authService.updateSession();

    const hashedPassword = await bcrypt.hash(password, 14);

    await connectDB();

    try {
      const updatedUser = {
        firstName,
        lastName,
        email,
        password: hashedPassword,
      };

      await User.findByIdAndUpdate(userId, updatedUser);
      console.log('User updated successfully.');
      return new NextResponse(null, { status: 200 });
    } catch (error) {
      console.error('Error updating user:', error);
      return new NextResponse('Auction not found.', { status: 404 });
    }
  } catch (error) {
    console.log('[PATCH:UPDATE-USER]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
