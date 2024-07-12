'use client';
import type { AuctionType } from '@/models/auction.model';
import { useLayoutEffect, useState, type FC } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const CheckoutReceiptModal: FC<{ auction: AuctionType }> = ({ auction }) => {
  const [open, setOpen] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const success = searchParams.get('success');
  const paymentIntentId = searchParams.get('paymentIntentId');
  const isPaymentSuccess = success === 'true';
  const isPaymentIntent = paymentIntentId !== '';

  useLayoutEffect(() => {
    if (isPaymentSuccess && isPaymentIntent) {
      handleOpen();
    }
  }, [isPaymentSuccess, isPaymentIntent]);

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <section key={paymentIntentId} className='flex justify-center'>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant='secondary' size='lg' className='w-24'>
            Receipt
          </Button>
        </DialogTrigger>
        <DialogContent className='w-11/12'>
          <DialogHeader>
            <DialogTitle className='flex flex-col gap-5'>
              <span className='text-center'>
                {isPaymentSuccess && isPaymentIntent && 'Checkout succeeded'}
              </span>
              <span>Your payment receipt:</span>
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className='flex flex-col gap-1'>
            <span className='border-b-2 pb-1'>
              Recipient id: {auction.paymentIntentId}
            </span>
            <span className='border-b-2 pb-1'>
              Auction seller: {auction.sellerName}
            </span>
            <span className='border-b-2 pb-1'>
              Alcohol type: {auction.type}
            </span>
          </DialogDescription>
          <DialogFooter>
            <span className='border-b-2 pb-1'>
              Your bid: {auction.currentBid}$
            </span>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default CheckoutReceiptModal;
