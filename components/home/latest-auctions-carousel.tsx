'use client';
import type { AuctionType } from '@/models/auction.model';
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
import Image from 'next/image';
import { useLayoutEffect, useState } from 'react';
import { getFormattedDateTimeString } from '@/lib/utils';

const LatestAuctionsCarousel = ({
  latestAuctions,
}: {
  latestAuctions: AuctionType[] | undefined;
}) => {
  const [timeRemaining, setTimeRemaining] = useState<number[]>([]);

  useLayoutEffect(() => {
    const updateTimer = () => {
      const now = new Date().getTime();
      const remainingTimes =
        latestAuctions?.map((auction: AuctionType) => {
          const duration = auction.endTime.getTime() - now;
          return duration > 0 ? duration : 0;
        }) ?? [];
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
            const formattedEndTime = getFormattedDateTimeString(
              auction.endTime
            );
            const formattedStartTime = getFormattedDateTimeString(
              auction.createdAt
            );
            const duration = timeRemaining[index];
            const auctionEnded = duration <= 0;
            const displayCountdown = !isNaN(duration);

            let hours = 0;
            let minutes = 0;
            let seconds = 0;

            if (displayCountdown) {
              hours = Math.floor(duration / (1000 * 60 * 60));
              minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
              seconds = Math.floor((duration % (1000 * 60)) / 1000);
            }

            return (
              <CarouselItem key={auction._id}>
                <Card className='py-7'>
                  <CardContent className='flex md:flex-row flex-col gap-5'>
                    <Image
                      priority
                      className='md:h-[570px] w-[470px] h-auto md:mb-0 mb-4 '
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
                        <span
                          className={`${
                            displayCountdown ? 'opacity-100' : 'opacity-0'
                          } transition-opacity duration-500 ease-in-out justify-center gap-2 flex-col mt-10 md:text-lg text-md flex items-center space-x-2`}>
                          <em className='dark:text-white text-black not-italic md:text-2xl'>
                            Time remaining
                          </em>
                          <time className='flex items-center space-x-1'>
                            {auctionEnded ? (
                              <span className='text-red-500 font-semibold'>
                                Auction ended
                              </span>
                            ) : (
                              <span className='flex items-center space-x-1'>
                                <em className='not-italic md:text-2xl text-lg bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 py-2 px-3 rounded-lg'>
                                  {hours < 10 ? `0${hours}h` : `${hours}h`}
                                </em>
                                <em className='not-italic md:text-2xl text-lg bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 py-2 px-3 rounded-lg'>
                                  {minutes < 10
                                    ? `0${minutes}m`
                                    : `${minutes}m`}
                                </em>
                                <em className='not-italic md:text-2xl text-lg bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 py-2 px-3 rounded-lg'>
                                  {seconds < 10
                                    ? `0${seconds}s`
                                    : `${seconds}s`}
                                </em>
                              </span>
                            )}
                          </time>
                        </span>
                      </CardDescription>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </section>
  );
};

export default LatestAuctionsCarousel;
