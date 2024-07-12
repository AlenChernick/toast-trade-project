'use client';
import type { AuctionType } from '@/models/auction.model';
import type { JwtUser } from '@/models/user.model';
import { useState, useLayoutEffect, useMemo, type FC } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card';
import {
  calculateTimeRemaining,
  getFormattedDateTimeString,
  getTimeVariables,
} from '@/lib/utils';
import Image from 'next/image';
import AddBidModal from '@/components/modals/add-bid-modal';
import AuctionTimer from '@/components/auction/auction-timer';
import AuctionItemBody from '@/components/auction/auction-item-body';

const AuctionItem: FC<{
  auction: AuctionType;
  loggedInUser: JwtUser | undefined;
}> = ({ auction, loggedInUser }) => {
  const auctionEndTime = useMemo(
    () => new Date(auction.endTime),
    [auction.endTime]
  );

  const initialTimeRemaining = calculateTimeRemaining(auctionEndTime);

  const [timeRemaining, setTimeRemaining] =
    useState<number>(initialTimeRemaining);

  const auctionCreatedTime = new Date(auction.createdAt);

  useLayoutEffect(() => {
    const timer = setInterval(() => {
      const newTimeRemaining = calculateTimeRemaining(auctionEndTime);
      setTimeRemaining(newTimeRemaining);
    }, 1000);

    return () => clearInterval(timer);
  }, [auctionEndTime]);

  const isAuctionEnded = auctionEndTime.getTime() < Date.now();

  const formattedEndTime = getFormattedDateTimeString(auctionEndTime);
  const formattedStartTime = getFormattedDateTimeString(auctionCreatedTime);

  const { hours, minutes, seconds } = getTimeVariables(timeRemaining);

  return (
    <section className='w-full'>
      <Card className='py-7'>
        <CardContent className='flex lg:flex-row flex-col gap-5'>
          <Image
            priority
            className='md:h-[570px] w-[470px] lg:m-0 m-auto h-auto md:mb-0 mb-4 rounded-md aspect-w-10:12'
            src={auction.itemImage}
            width={900}
            height={1200}
            alt={auction.itemName}
          />
          <div className='flex flex-col gap-2'>
            <CardTitle className='md:text-3xl text-lg break-normal'>
              {auction.itemName}
            </CardTitle>
            <CardDescription className='flex flex-col'>
              <AuctionItemBody
                auction={auction}
                formattedStartTime={formattedStartTime}
                formattedEndTime={formattedEndTime}
              />
              <AuctionTimer
                isAuctionEnded={isAuctionEnded}
                hours={hours}
                minutes={minutes}
                seconds={seconds}
              />
            </CardDescription>
          </div>
          {!isAuctionEnded && (
            <AddBidModal loggedInUser={loggedInUser} auction={auction} />
          )}
        </CardContent>
      </Card>
    </section>
  );
};

export default AuctionItem;
