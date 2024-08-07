import { loadStripe } from '@stripe/stripe-js';
import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY as string;
const stripePublicKey = process.env
  .NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string;

const stripePromise = loadStripe(stripePublicKey);

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2024-04-10',
  appInfo: {
    name: 'ToastTrade',
    url: 'https://nextjs-with-stripe-typescript-demo.vercel.app',
  },
});

const createStripePaymentIntents = async (
  amount: number,
  email: string,
  fullName: string,
  username: string,
  title: string
) => {
  const { client_secret } = await stripe.paymentIntents.create({
    amount,
    currency: 'usd',
    receipt_email: email,
    automatic_payment_methods: {
      enabled: true,
    },
    metadata: {
      title,
      email,
      fullName,
      username,
    },
  });

  return client_secret;
};

const getStripePaymentIntent = async (paymentIntentId: string) => {
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
  return paymentIntent;
};

export const stripeService = {
  createStripePaymentIntents,
  getStripePaymentIntent,
  stripePromise,
};
