'use client';
import { convertToSubCurrency } from '@/lib/utils';
import {
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { useParams } from 'next/navigation';
import { type FC, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const CheckoutForm: FC<{ amount: number; auctionId: string }> = ({
  amount,
  auctionId,
}) => {
  const params = useParams();
  const stripe = useStripe();
  const elements = useElements();
  const userId = params.userId;
  const originUrl = window.location.origin;

  const [errorMessage, setErrorMessage] = useState<string | undefined>('');
  const [clientSecret, setClientSecret] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    fetch('/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: convertToSubCurrency(amount),
        userId: userId,
      }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
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
      {clientSecret && <PaymentElement />}
      {errorMessage && <div>{errorMessage}</div>}
      <Button
        size='lg'
        className='text-md h-12'
        disabled={!stripe || isLoading}
        type='submit'>
        {!isLoading ? `Pay ${amount}$` : 'Processing...'}
      </Button>
    </form>
  );
};

export default CheckoutForm;
