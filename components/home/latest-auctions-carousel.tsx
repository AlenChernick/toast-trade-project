'use client';
import { type FC, useLayoutEffect, useMemo, useState } from 'react';
import type { AuctionType } from '@/models/auction.model';
import { AppRoutes } from '@/enum';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card';
import {
  calculateRemainingTimes,
  getFormattedDateTimeString,
  getTimeVariables,
} from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import AuctionTimer from '@/components/auction/auction-timer';
import AuctionItemBody from '@/components/auction/auction-item-body';

const LatestAuctionsCarousel: FC<{
  latestAuctions: AuctionType[] | undefined;
}> = ({ latestAuctions }) => {
  const initialTimeRemaining = useMemo(
    () => (latestAuctions ? calculateRemainingTimes(latestAuctions) : []),
    [latestAuctions]
  );

  const [timeRemaining, setTimeRemaining] =
    useState<number[]>(initialTimeRemaining);

  useLayoutEffect(() => {
    const updateTimer = () => {
      const remainingTimes = latestAuctions
        ? calculateRemainingTimes(latestAuctions)
        : [];
      setTimeRemaining(remainingTimes);
    };

    const timer = setInterval(updateTimer, 1000);

    return () => clearInterval(timer);
  }, [latestAuctions]);

  return (
    <section>
      <Carousel>
        <CarouselContent className='-ml-0'>
          {latestAuctions?.map((auction: AuctionType, index) => {
            const auctionEndTime = new Date(auction.endTime);
            const auctionCreatedTime = new Date(auction.createdAt);
            const formattedEndTime = getFormattedDateTimeString(auctionEndTime);
            const formattedStartTime =
              getFormattedDateTimeString(auctionCreatedTime);
            const duration = timeRemaining[index];
            const isAuctionEnded = duration <= 0;
            const displayCountdown = !isNaN(duration);

            let hours = 0;
            let minutes = 0;
            let seconds = 0;

            if (displayCountdown) {
              const timeVariables = getTimeVariables(duration);
              hours = timeVariables.hours;
              minutes = timeVariables.minutes;
              seconds = timeVariables.seconds;
            }

            return (
              <CarouselItem key={auction._id} className='pl-0'>
                <Card className='py-7'>
                  <CardContent className='flex lg:flex-row flex-col gap-5'>
                    <Image
                      priority
                      className='md:h-[570px] w-[470px] m-auto lg:m-0 h-auto md:mb-0 mb-4 rounded-md aspect-w-10:12'
                      src={auction.itemImage}
                      width={900}
                      height={1200}
                      alt={auction.auctionName}
                    />
                    <div className='flex flex-col gap-2'>
                      <CardTitle className='md:text-3xl text-lg break-normal'>
                        {auction.auctionName}
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
                        <Link
                          href={`${AppRoutes.Auction}/${auction._id}`}
                          title={`View: ${auction.auctionName}`}
                          className='flex justify-center mt-10'>
                          <Button>View auction</Button>
                        </Link>
                      </CardDescription>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious className='hidden md:flex' />
        <CarouselNext className='hidden md:flex' />
      </Carousel>
    </section>
  );
};

export default LatestAuctionsCarousel;
