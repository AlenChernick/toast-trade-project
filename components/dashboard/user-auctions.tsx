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
import { DashboardActionType } from '@/enum';
import { Button } from '@/components/ui/button';
import { getFormattedDateTimeString } from '@/lib/utils';
import DeleteAuctionAlert from '@/components/dashboard/delete-auction-alert';
import Image from 'next/image';
import Link from 'next/link';
import WatchBidsModal from '@/components/modals/watch-bids-modal';

const UserAuctions: FC<{ userId: string }> = async ({ userId }) => {
  const auctionsList = await auctionService.getUserAuctions(userId);

  return (
    <section className='grid place-items-center md:place-items-start md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
      {auctionsList?.length ? (
        auctionsList.map((auction: AuctionType) => {
          const auctionEndTime = new Date(auction.endTime);
          const auctionStartTime = new Date(auction.createdAt);
          const formattedEndTime = getFormattedDateTimeString(auctionEndTime);
          const formattedStartTime =
            getFormattedDateTimeString(auctionStartTime);
          const isActive = new Date() < auctionEndTime;
          const auctionHasBids = auction.bids?.length > 0;

          return (
            <Card
              key={auction._id}
              className='w-full md:max-w-[320px] md:h-full'>
              <CardHeader className='p-4'>
                <CardTitle className='leading-8 md:text-base text-xl'>
                  {auction.itemName}
                </CardTitle>
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
                <Link
                  href={`/dashboard/${userId}?type=${DashboardActionType.CreateOrEditAuction}&auctionId=${auction._id}`}>
                  <Button variant='secondary'>Edit</Button>
                </Link>
                <WatchBidsModal auctionBids={auction.bids} />
                <DeleteAuctionAlert
                  userId={userId}
                  auctionId={auction._id}
                  auctionHasBids={auctionHasBids}
                />
              </CardFooter>
            </Card>
          );
        })
      ) : (
        <div>No auctions created yet...</div>
      )}
    </section>
  );
};

export default UserAuctions;
