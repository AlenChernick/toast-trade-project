'use client';
import { type FC, useEffect, useState } from 'react';
import type { AuctionType } from '@/models/auction.model';
import type { JwtUser } from '@/models/user.model';
import { convertToSubCurrency } from '@/lib/utils';
import {
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const CheckoutForm: FC<{ auction: AuctionType; loggedInUser: JwtUser }> = ({
  auction,
  loggedInUser,
}) => {
  const params = useParams();
  const stripe = useStripe();
  const elements = useElements();
  const userId = params.userId;
  const originUrl = window.location.origin;
  const auctionId = auction._id;
  const auctionTitle = auction.itemName;
  const userEmail = loggedInUser.email;
  const userFullName = `${loggedInUser.firstName} ${loggedInUser.lastName}`;
  const username = loggedInUser.username;
  const amount = auction.currentBid;

  const [errorMessage, setErrorMessage] = useState<string | undefined>('');
  const [clientSecret, setClientSecret] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isStripeLoading, setIsStripeLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch('/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: convertToSubCurrency(amount),
        userId,
        userEmail,
        userFullName,
        username,
        auctionTitle,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret);
        setIsStripeLoading(false);
      });
  }, [amount]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error: submitError } = await elements.submit();

    if (submitError) {
      setErrorMessage(submitError.message);
      setIsLoading(false);
      toast.error(submitError.message);
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `${originUrl}/api/checkout?amount=${amount}&userId=${userId}&auctionId=${auctionId}`,
      },
    });

    if (error) {
      setErrorMessage(error.message);
      toast.error(error.message);
    }

    setIsLoading(false);
  };

  return (
    <form
      className='flex flex-col justify-center gap-5'
      onSubmit={handleSubmit}>
      {isStripeLoading ? (
        <div className='my-2 flex justify-center items-center'>
          <div className='w-32 h-32 border-primary border-l-5 border-r-5 border-t-4 rounded-full animate-spin duration-3000' />
        </div>
      ) : (
        <>
          {clientSecret && <PaymentElement />}
          {errorMessage && <div>{errorMessage}</div>}
          <Button
            size='lg'
            className='text-md h-12'
            disabled={!stripe || isLoading}
            type='submit'>
            {!isLoading ? `Pay ${amount}$` : 'Processing...'}
          </Button>
        </>
      )}
    </form>
  );
};

export default CheckoutForm;
