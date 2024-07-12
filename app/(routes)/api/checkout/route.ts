import { NextRequest, NextResponse } from 'next/server';
import { stripeService } from '@/services/stripe.service';
import { authService } from '@/services/auth.service';
import { Auction } from '@/models/auction.model';
import { DashboardActionType } from '@/enum';
import connectDB from '@/services/db.service';

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const { amount, userId, userEmail, userFullName, username, auctionTitle } =
      await req.json();

    if (
      !amount ||
      !userId ||
      !userEmail ||
      !userFullName ||
      !username ||
      !auctionTitle
    ) {
      return new NextResponse('Missing parameters', { status: 400 });
    }

    const loggedInUser = await authService.getLoggedInUser();

    if (loggedInUser?._id != userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const clientSecret = await stripeService.createStripePaymentIntents(
      amount,
      userEmail,
      userFullName,
      username,
      auctionTitle
    );

    return NextResponse.json({ clientSecret }, { status: 200 });
  } catch (error) {
    console.log('[POST:CHECKOUT]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const { searchParams } = new URL(req.nextUrl);
    const amountParam = searchParams.get('amount');
    const userId = searchParams.get('userId');
    const auctionId = searchParams.get('auctionId');
    const paymentIntentId = searchParams.get('payment_intent');

    console.log('paymentIntentId:', paymentIntentId);

    if (!amountParam || !userId || !auctionId || !paymentIntentId) {
      return new NextResponse('Missing parameters', { status: 400 });
    }

    const loggedInUser = await authService.getLoggedInUser();

    if (loggedInUser?._id != userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    await connectDB();

    try {
      const updatedAuction = {
        paymentCompleted: true,
        paymentIntentId: paymentIntentId,
      };

      await Auction.findByIdAndUpdate(auctionId, updatedAuction);

      const successUrl = new URL(`/dashboard/${userId}`, req.url);
      successUrl.searchParams.set('type', DashboardActionType.UserBids);
      successUrl.searchParams.set('success', 'true');
      successUrl.searchParams.set('paymentIntentId', paymentIntentId);

      return NextResponse.redirect(successUrl);
    } catch (error) {
      console.error('Error updating auction:', error);
      return new NextResponse('Error updating auction.', { status: 404 });
    }
  } catch (error) {
    console.log('[GET:CHECKOUT]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
