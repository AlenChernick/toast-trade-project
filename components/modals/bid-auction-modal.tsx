import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import type { JWTPayload } from 'jose';
import type { AuctionType } from '@/models/auction.model';
import Link from 'next/link';

const BidAuctionModal = ({
  loggedInUser,
  auction,
}: {
  loggedInUser: JWTPayload | undefined;
  auction: AuctionType;
}) => {
  const currentBid = auction.currentBid;
  const formSchema = z.object({
    newBidValue: z
      .union([z.string(), z.number()])
      .transform((val) => {
        let num;
        if (typeof val === 'string') {
          num = parseFloat(val);
        } else if (typeof val === 'number') {
          num = val;
        } else {
          throw new Error('Invalid type, expecting string or number.');
        }
        return num;
      })
      .refine((val) => val > currentBid, {
        message: `Bid must be higher than ${currentBid}$`,
      }),
  });
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newBidValue: currentBid,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);

      const userId = loggedInUser?._id;
      const firstName = loggedInUser?.firstName;
      const lastName = loggedInUser?.lastName;
      const auctionId = auction._id;
      const auctionCreatorId = auction.userId;
      const auctionBids = auction.bids;
      const isAuctionEnded = auction.endTime.getTime() < Date.now();

      if (isAuctionEnded) {
        toast.error('Auction ended');
        form.reset();
        setOpen(false);
        return;
      }

      if (auctionCreatorId === userId) {
        toast.error('Cannot add bid to your own auction');
        form.reset();
        setOpen(false);
        return;
      }

      const response = await fetch('/api/auction', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...values,
          isAuctionEnded,
          userId,
          auctionCreatorId,
          firstName,
          lastName,
          auctionId,
          auctionBids,
        }),
      });

      if (!response.ok) {
        toast.error('Failed to add bid.');
        throw new Error('Failed to add bid');
      }

      toast.success('Bid added successfully.');
      setOpen(false);
      form.reset();
      router.refresh();
    } catch (error) {
      setIsLoading(false);
      toast.error('Something went wrong.');
      console.error((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!form.formState.isValid) setOpen(true);
  };

  return (
    <section>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant='outline'>Add Bid</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {loggedInUser ? 'Are you absolutely sure?' : 'Sign in please'}
            </DialogTitle>
          </DialogHeader>
          <div>
            {loggedInUser ? (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className='flex flex-col justify-center max-w-80 m-auto gap-5'>
                  <FormField
                    control={form.control}
                    name='newBidValue'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your bid</FormLabel>
                        <FormControl>
                          <Input
                            disabled={isLoading}
                            className='input'
                            type='number'
                            autoComplete='current-username'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter className='flex justify-between'>
                    <DialogClose>Cancel</DialogClose>
                    <Button
                      onClick={handleClose}
                      disabled={isLoading}
                      type='submit'>
                      Add bid
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            ) : (
              'You are not signed in, to add a bid to an auction you need to sign in.'
            )}
          </div>
          {!loggedInUser && (
            <DialogFooter className='flex gap-2'>
              <DialogClose>Cancel</DialogClose>
              <Link href='/sign-in' title='Sign in'>
                <Button>Sign In</Button>
              </Link>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default BidAuctionModal;
