import type { FC } from 'react';
import type { UserBid } from '@/models/auction.model';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

const WatchBidsModal: FC<{ bids: UserBid[] }> = ({ bids }) => {
  return (
    <section className='flex justify-center'>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant='outline' size='lg' className='w-28'>
            Watch Bids
          </Button>
        </DialogTrigger>
        <DialogContent className='w-11/12'>
          <DialogHeader>
            <DialogTitle>Watch Bids</DialogTitle>
          </DialogHeader>
          <div>
            {bids.length ? (
              <ScrollArea className='h-96 px-5'>
                {bids.map((bid) => (
                  <ul
                    key={bid._id}
                    className='flex flex-col items-center rounded-lg gap-2 border-2 border-primary mb-4 last:mb-0 p-2'>
                    <li>{`Bid by: ${bid.firstName} ${bid.lastName}`}</li>
                    <li>{`Bid value: ${bid.bid}$`}</li>
                  </ul>
                ))}
                <ScrollBar orientation='vertical' />
              </ScrollArea>
            ) : (
              <p>No bids yet.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default WatchBidsModal;
