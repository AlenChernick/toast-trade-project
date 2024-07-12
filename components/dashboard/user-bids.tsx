import type { FC } from 'react';
import type { AuctionType } from '@/models/auction.model';
import type { JwtUser } from '@/models/user.model';
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
import CheckoutModal from '@/components/modals/checkout-modal';
import AuctionBody from '@/components/dashboard/auction-body';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';

const CheckoutReceiptModal = dynamic(
  () => import('@/components/modals/checkout-receipt-modal'),
  {
    ssr: false,
  }
);

const UserBids: FC<{
  userId: string;
  loggedInUser: JwtUser;
}> = async ({ userId, loggedInUser }) => {
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
          const isAuctionActive = new Date() < auctionEndTime;
          const userBids = auction.bids.filter((bid) => bid.userId === userId);
          const isUserBidIsHighest = auction.bids.some(
            (bid) => bid.userId === userId && bid.bid === auction.currentBid
          );
          const isPaymentCompleted = auction.paymentCompleted;

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
                {!isAuctionActive && !isPaymentCompleted && (
                  <p className='text-center text-primary relative top-3'>
                    {isUserBidIsHighest
                      ? 'You are the highest bidder!'
                      : 'You are not the highest bidder, maybe next time'}
                  </p>
                )}
              </CardContent>
              <CardFooter className='p-4 flex justify-between items-center relative bottom-0'>
                <WatchBidsModal bids={userBids} />
                {!isAuctionActive &&
                  !isPaymentCompleted &&
                  isUserBidIsHighest && (
                    <CheckoutModal
                      auction={auction}
                      loggedInUser={loggedInUser}
                    />
                  )}
                {!isAuctionActive &&
                  isPaymentCompleted &&
                  isUserBidIsHighest && (
                    <CheckoutReceiptModal auction={auction} />
                  )}
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
