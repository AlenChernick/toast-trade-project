import { NextRequest } from 'next/server';
import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY as string;

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2024-04-10',
  appInfo: {
    name: 'ToastTrade',
    url: 'https://nextjs-with-stripe-typescript-demo.vercel.app',
  },
});

const getStripeCheckoutSession = async (
  req: Request,
  userId: string,
  productName: string,
  priceAmount: number,
  currency: string,
  quantity: number
) => {
  try {
    let product = (
      await stripe.products.search({
        query: `name:'${productName}'`,
      })
    ).data.find((item) => item.active);

    if (!product) {
      product = await stripe.products.create({
        name: productName,
        description: productName,
      });
    }

    let price = (
      await stripe.prices.search({
        query: `product:'${product.id}' AND currency:'${currency}'`,
      })
    ).data.find((item) => item.active);

    if (!price) {
      price = await stripe.prices.create({
        product: product.id,
        unit_amount: priceAmount * 100,
        currency: currency,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: price.id,
          quantity: quantity,
        },
      ],
      mode: 'payment',
      success_url: `${req.url}/?success=true&sessionId={CHECKOUT_SESSION_ID}&userId=${userId}`,
      cancel_url: `${req.url}/?canceled=true`,
    });

    return session;
  } catch (error) {
    console.error((error as Error).message);
    throw new Error('Failed to create Stripe checkout session');
  }
};

export const stripeService = {
  getStripeCheckoutSession,
};
