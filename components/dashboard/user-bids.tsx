import type { FC } from 'react';
import type { AuctionType } from '@/models/auction.model';
import { auctionService } from '@/services/auction.service';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getFormattedDateTimeString } from '@/lib/utils';
import WatchBidsModal from '@/components/modals/watch-bids-modal';
import Image from 'next/image';
import Link from 'next/link';

const UserBids: FC<{ userId: string }> = async ({ userId }) => {
  const userBidsAuctions: AuctionType[] =
    await auctionService.getUserBidsAuctions(userId);

  return (
    <section className='grid place-items-center md:place-items-start md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
      {userBidsAuctions?.length ? (
        userBidsAuctions.map((auction: AuctionType) => {
          const auctionEndTime = new Date(auction.endTime);
          const auctionStartTime = new Date(auction.createdAt);
          const formattedEndTime = getFormattedDateTimeString(auctionEndTime);
          const formattedStartTime =
            getFormattedDateTimeString(auctionStartTime);
          const isActive = new Date() < auctionEndTime;
          const userBids = auction.bids.filter((bid) => bid.userId === userId);

          return (
            <Card
              key={auction._id}
              className='w-full md:max-w-[320px] md:h-full'>
              <CardHeader className='p-4'>
                <Link href={`/auction/${auction._id}`} title={auction.itemName}>
                  <CardTitle className='leading-8 md:text-base text-xl hover:text-primary'>
                    {auction.itemName}
                  </CardTitle>
                </Link>
                <CardDescription className='flex flex-col gap-1'>
                  <span className='border-b-2 pb-1'>
                    Auction seller: {auction.sellerName}
                  </span>
                  <span className='border-b-2 pb-1'>
                    Alcohol type: {auction.type}
                  </span>
                  <span className='border-b-2 pb-1'>
                    Starting bid: {auction.startingBid}$
                  </span>
                  <span className='border-b-2 pb-1'>
                    Current bid: {auction.currentBid}$
                  </span>
                  <time
                    className='border-b-2 pb-1'
                    dateTime={auction.endTime.toString()}>
                    Start date: {formattedStartTime}
                  </time>
                  <time
                    className='border-b-2 pb-1'
                    dateTime={auction.endTime.toString()}>
                    End date: {formattedEndTime}
                  </time>
                  <span className='border-b-2 pb-1'>
                    Status:{' '}
                    {isActive ? (
                      <em className='not-italic text-green-400'>Active</em>
                    ) : (
                      <em className='not-italic text-primary'>Ended</em>
                    )}
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent className='p-4 py-1'>
                <Image
                  priority
                  className='object-contain rounded-md'
                  width={900}
                  height={1200}
                  src={auction.itemImage}
                  alt={auction.itemName}
                />
              </CardContent>
              <CardFooter className='p-4 flex justify-between items-center relative bottom-0'>
                <WatchBidsModal auctionBids={userBids} />
              </CardFooter>
            </Card>
          );
        })
      ) : (
        <div>No bids yet...</div>
      )}
    </section>
  );
};

export default UserBids;
