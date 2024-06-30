'use client';
import type { FC } from 'react';
import { Button } from '@/components/ui/button';
import { AuctionType } from '@/models/auction.model';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { DialogHeader } from '../ui/dialog';
import { stripeService } from '@/services/stripe.service';
import { convertToSubCurrency } from '@/lib/utils';
import { Elements } from '@stripe/react-stripe-js';
import { useTheme } from 'next-themes';
import CheckoutForm from '@/components/dashboard/checkout-form';

const CheckoutModal: FC<{ auction: AuctionType }> = ({ auction }) => {
  const { theme } = useTheme();
  const auctionId = auction._id;
  const auctionBid = auction.currentBid;

  return (
    <section className='flex items-center justify-center'>
      <Dialog>
        <DialogTrigger asChild>
          <Button className='w-28'>Claim bottle</Button>
        </DialogTrigger>
        <DialogContent className='w-11/12'>
          <DialogHeader className='mt-4'>
            <DialogTitle className='text-lg'>
              Checkout for{' '}
              <span className='text-primary'>{auction.itemName}</span>
            </DialogTitle>
          </DialogHeader>
          <Elements
            stripe={stripeService.stripePromise}
            options={{
              mode: 'payment',
              amount: convertToSubCurrency(auctionBid),
              currency: 'usd',
              locale: 'en',
              appearance: {
                theme: theme === 'dark' ? 'night' : 'stripe',
              },
            }}>
            <CheckoutForm amount={auctionBid} auctionId={auctionId} />
          </Elements>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default CheckoutModal;
