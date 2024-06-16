import { authService } from '@/services/auth.service';
import { stripeService } from '@/services/stripe.service';
import { NextRequest, NextResponse } from 'next/server';
import { redirect } from 'next/navigation';

export async function POST(req: NextRequest) {
  try {
    const { userId, productName, priceAmount, currency, quantity } =
      await req.json();

    if (!productName || !priceAmount || !currency || !quantity) {
      return new NextResponse('Missing parameters', { status: 400 });
    }

    const loggedInUser = await authService.getLoggedInUser();

    if (loggedInUser?._id != userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { url } = await stripeService.getStripeCheckoutSession(
      req,
      userId,
      productName,
      priceAmount,
      currency,
      quantity
    );

    return NextResponse.json({ sessionUrl: url }, { status: 307 });
  } catch (error) {
    console.log('[POST:CHECKOUT]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const success = searchParams.get('success');
    const canceled = searchParams.get('canceled');
    const sessionId = searchParams.get('sessionId');
    const userId = searchParams.get('userId');
    console.log(success, sessionId, userId);

    const loggedInUser = await authService.getLoggedInUser();

    if (loggedInUser?._id != userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // const stripeSession = await stripeService.getStripeCheckoutSession(
    //   req,
    //   productName,
    //   priceAmount,
    //   currency,
    //   quantity
    // );

    return NextResponse.json(null, { status: 301 });
  } catch (error) {
    console.log('[GET:CHECKOUT]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
