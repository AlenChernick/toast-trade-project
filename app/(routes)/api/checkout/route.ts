import { NextRequest, NextResponse } from 'next/server';
import { stripeService } from '@/services/stripe.service';
import connectDB from '@/services/db.service';
import { authService } from '@/services/auth.service';
import { Auction } from '@/models/auction.model';

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const { amount, userId } = await req.json();

    if (!amount || !userId) {
      return new NextResponse('Missing parameters', { status: 400 });
    }

    const loggedInUser = await authService.getLoggedInUser();

    if (loggedInUser?._id != userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const clientSecret = await stripeService.createStripePaymentIntents(amount);

    return NextResponse.json({ clientSecret }, { status: 200 });
  } catch (error) {
    console.log('[POST:CHECKOUT]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const { searchParams } = new URL(req.nextUrl);
    const amount = searchParams.get('amount');
    const userId = searchParams.get('userId');
    const auctionId = searchParams.get('auctionId');
    const paymentIntent = searchParams.get('payment_intent');

    if (!amount || !userId || !auctionId || !paymentIntent) {
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
      };

      await Auction.findByIdAndUpdate(auctionId, updatedAuction);

      const successUrl = new URL(`/dashboard/${userId}`, req.url);
      successUrl.searchParams.set('type', 'userBids');
      successUrl.searchParams.set('success', 'true');
      successUrl.searchParams.set('paymentIntent', paymentIntent);

      return NextResponse.redirect(successUrl);
    } catch (error) {
      console.error('Error updating auction in db:', error);
      return new NextResponse('Error updating auction in db.', { status: 404 });
    }
  } catch (error) {
    console.log('[GET:CHECKOUT]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
