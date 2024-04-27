import { getAuctionsList } from '@/services/auction.service';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import React from 'react';
import type { AuctionType } from '@/models/auction.model';
import { AuctionActionType } from '@/enum';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

const AuctionsList = async ({ userId }: { userId: string }) => {
  const auctionsList = await getAuctionsList(userId);

  return (
    <section className='grid md:grid-cols-2 gap-4'>
      {auctionsList?.length ? (
        auctionsList.map((auction: AuctionType) => {
          const formattedDateTime = `${auction.endTime.toDateString()} ${auction.endTime.getHours()}:${auction.endTime.getMinutes()}`;
          return (
            <Card key={auction._id} className='max-w-[320px]'>
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
                    Starting bid: {auction.startingBid}
                  </span>
                  <span className='border-b-2 pb-1'>
                    Current bid: {auction.currentBid}
                  </span>
                  <time
                    className='border-b-2 pb-1'
                    dateTime={auction.endTime.toString()}>
                    End time: {formattedDateTime}
                  </time>
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
              <CardFooter className='p-4 flex justify-between'>
                <Link
                  href={`/dashboard/${userId}?type=${AuctionActionType.CreateOrEditAuction}&auctionId=${auction._id}`}>
                  <Button variant='secondary'>Edit</Button>
                </Link>
                <Button variant='destructive'>Delete</Button>
              </CardFooter>
            </Card>
          );
        })
      ) : (
        <div>You didn't created auctions yet...</div>
      )}
    </section>
  );
};

export default AuctionsList;