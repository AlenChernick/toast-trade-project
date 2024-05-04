'use client';
import { useState, useLayoutEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card';
import { getFormattedDateTimeString } from '@/lib/utils';
import type { AuctionType } from '@/models/auction.model';
import type { JWTPayload } from 'jose';
import Image from 'next/image';
import AddBidModal from '@/components/modals/add-bid-modal';

const AuctionItem = ({
  auction,
  loggedInUser,
}: {
  auction: AuctionType;
  loggedInUser: JWTPayload | undefined;
}) => {
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const auctionEndTime = new Date(auction.endTime);
  const auctionCreatedTime = new Date(auction.createdAt);

  useLayoutEffect(() => {
    const timer = setInterval(() => {
      const newTimeRemaining = Math.max(
        0,
        auctionEndTime.getTime() - Date.now()
      );
      setTimeRemaining(newTimeRemaining);
    }, 1000);

    return () => clearInterval(timer);
  }, [auctionEndTime]);

  const isAuctionEnded = auctionEndTime.getTime() < Date.now();

  const formattedEndTime = getFormattedDateTimeString(auctionEndTime);
  const formattedStartTime = getFormattedDateTimeString(auctionCreatedTime);

  const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
  const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

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
              <span className='md:md:text-lg text-md'>
                <em className='dark:text-white text-black not-italic'>
                  Seller name:{' '}
                </em>
                {auction.sellerName}
              </span>
              <span className='md:text-lg text-md'>
                <em className='dark:text-white text-black not-italic'>
                  Alcohol type:{' '}
                </em>
                {auction.type}
              </span>
              <span className='md:text-lg text-md'>
                <em className='dark:text-white text-black not-italic'>
                  Starting bid:{' '}
                </em>
                {auction.startingBid}$
              </span>
              <span className='md:text-lg text-md'>
                <em className='dark:text-white text-black not-italic'>
                  Current bid:{' '}
                </em>
                {auction.currentBid}$
              </span>
              <span className='md:text-lg text-md'>
                <em className='dark:text-white text-black not-italic'>
                  Start date:{' '}
                </em>
                <time>{formattedStartTime}</time>
              </span>
              <span className='md:text-lg text-md'>
                <em className='dark:text-white text-black not-italic'>
                  End date:{' '}
                </em>
                <time>{formattedEndTime}</time>
              </span>
              <span>
                <em className='not-italic'></em>
              </span>
              {isAuctionEnded ? (
                <span className='text-red-500 font-semibold md:text-2xl flex justify-center mt-10'>
                  Auction ended
                </span>
              ) : (
                <span
                  className={`${
                    timeRemaining > 0 ? 'opacity-100' : 'opacity-0'
                  } transition-opacity duration-500 ease-in-out justify-center gap-2 flex-col mt-10 md:text-lg text-md flex items-center space-x-2`}>
                  <em className='dark:text-white text-black not-italic md:text-2xl'>
                    Time remaining
                  </em>
                  <time className='flex items-center space-x-1'>
                    <span className='flex items-center space-x-1'>
                      <em className='not-italic md:text-2xl text-lg bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 py-2 px-3 rounded-lg'>
                        {hours < 10 ? `0${hours}` : hours}h
                      </em>
                      <em className='not-italic md:text-2xl text-lg bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 py-2 px-3 rounded-lg'>
                        {minutes < 10 ? `0${minutes}` : minutes}m
                      </em>
                      <em className='not-italic md:text-2xl text-lg bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 py-2 px-3 rounded-lg'>
                        {seconds < 10 ? `0${seconds}` : seconds}s
                      </em>
                    </span>
                  </time>
                </span>
              )}
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
