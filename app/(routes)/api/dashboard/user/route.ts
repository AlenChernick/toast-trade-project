import { User, type UserType } from '@/models/user.model';
import { NextResponse } from 'next/server';
import { authService } from '@/services/auth.service';
import bcrypt from 'bcrypt';
import connectDB from '@/services/db.service';

export async function PATCH(req: Request) {
  try {
    const { userId, firstName, lastName, email, password } = await req.json();

    if (!userId || !firstName || !lastName || !email || !password) {
      return new NextResponse('Missing parameters', { status: 400 });
    }

    const loggedInUser = await authService.getLoggedInUser();

    if (loggedInUser?._id != userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    authService.updateSession();

    const hashedPassword = await bcrypt.hash(password, 14);

    try {
      const updatedUser = {
        firstName,
        lastName,
        email,
        password: hashedPassword,
      };

      await connectDB();
      await User.findByIdAndUpdate(userId, updatedUser);
      console.log('User updated successfully.');
      return new NextResponse(null, { status: 200 });
    } catch (error) {
      console.error('Error updating user:', error);
      return new NextResponse('user not found.', { status: 404 });
    }
  } catch (error) {
    console.log('[PATCH:UPDATE-USER]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { userId, isUserHaveActiveAuctionsOrBids } = await req.json();

    if (!userId || !isUserHaveActiveAuctionsOrBids) {
      return new NextResponse('Missing parameters', { status: 400 });
    }

    if (isUserHaveActiveAuctionsOrBids) {
      return new NextResponse(
        'Cannot delete user with active auctions or bids',
        { status: 400 }
      );
    }

    const loggedInUser = await authService.getLoggedInUser();

    if (loggedInUser?._id != userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    try {
      await connectDB();
      await User.findByIdAndDelete(userId);
      await authService.signOut();
      console.log('User deleted successfully.');
      return new NextResponse(null, { status: 200 });
    } catch (error) {
      console.error('Error deleted user:', error);
      return new NextResponse('user not found.', { status: 404 });
    }
  } catch (error) {
    console.log('[PATCH:DELETE-USER]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
