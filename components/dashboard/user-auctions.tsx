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
import { AppRoutes, DashboardActionType } from '@/enum';
import { Button } from '@/components/ui/button';
import { getFormattedDateTimeString } from '@/lib/utils';
import DeleteAuctionAlert from '@/components/dashboard/delete-auction-alert';
import WatchBidsModal from '@/components/modals/watch-bids-modal';
import AuctionBody from '@/components/dashboard/auction-body';
import Image from 'next/image';
import Link from 'next/link';

const UserAuctions: FC<{ userId: string }> = async ({ userId }) => {
  const auctionsList: AuctionType[] = await auctionService.getUserAuctions(
    userId
  );

  return (
    <section className='grid place-items-center md:place-items-start md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
      {auctionsList?.length ? (
        auctionsList.map((auction: AuctionType) => {
          const auctionEndTime = new Date(auction.endTime);
          const auctionStartTime = new Date(auction.createdAt);
          const formattedEndTime = getFormattedDateTimeString(auctionEndTime);
          const formattedStartTime =
            getFormattedDateTimeString(auctionStartTime);
          const isAuctionActive = new Date() < auctionEndTime;
          const auctionHasBids = auction.bids?.length > 0;
          const auctionImageUrl = auction.itemImage;
          const isPaymentCompleted = auction.paymentCompleted;

          return (
            <Card
              key={auction._id}
              className='w-full md:max-w-[320px] md:h-full'>
              <CardHeader className='p-4'>
                <Link
                  href={`${AppRoutes.Auction}/${auction._id}`}
                  title={auction.itemName}>
                  <CardTitle className='leading-8 md:text-base text-xl hover:text-primary'>
                    {auction.itemName}
                  </CardTitle>
                </Link>
                <CardDescription className='flex flex-col gap-1'>
                  <AuctionBody
                    auction={auction}
                    formattedStartTime={formattedStartTime}
                    formattedEndTime={formattedEndTime}
                    isAuctionActive={isAuctionActive}
                    isPaymentCompleted={isPaymentCompleted}
                  />
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
              <CardFooter className='p-4 flex justify-between items-center'>
                {isAuctionActive && (
                  <Link
                    title={`Edit ${auction.itemName} auction`}
                    href={`${AppRoutes.Dashboard}/${userId}?type=${DashboardActionType.CreateOrEditAuction}&auctionId=${auction._id}`}>
                    <Button variant='secondary'>Edit</Button>
                  </Link>
                )}
                <WatchBidsModal bids={auction.bids} />
                {isAuctionActive && (
                  <DeleteAuctionAlert
                    userId={userId}
                    auctionId={auction._id}
                    auctionHasBids={auctionHasBids}
                    auctionImageUrl={auctionImageUrl}
                  />
                )}
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
