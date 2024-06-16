'use client';
import { useState, type FC } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { AuctionType } from '@/models/auction.model';

const Checkout: FC<{ auction: AuctionType; userId: string }> = ({
  auction,
  userId,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleCheckout = async () => {
    try {
      setIsLoading(true);

      const response = await fetch('/api/auth/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          productName: auction.itemName,
          priceAmount: auction.currentBid,
          currency: 'usd',
          quantity: 1,
        }),
      });

      if (response.status === 307) {
        const { sessionUrl } = await response.json();
        router.push(sessionUrl);
      }

      if (!response.ok) {
        toast.error('Something went wrong.');
        throw new Error('Something went wrong.');
      }

      //   toast.success(`Auction deleted successfully.`);
      //   router.refresh();
    } catch (error) {
      setIsLoading(false);
      toast.error('Something went wrong.');
      console.error((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section>
      <Button disabled={isLoading} className='w-28' onClick={handleCheckout}>
        Claim bottle
      </Button>
    </section>
  );
};

export default Checkout;
