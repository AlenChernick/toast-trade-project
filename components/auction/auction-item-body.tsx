import { AuctionType } from '@/models/auction.model';
import type { FC } from 'react';

const AuctionItemBody: FC<{
  auction: AuctionType;
  formattedStartTime: string;
  formattedEndTime: string;
}> = ({ auction, formattedStartTime, formattedEndTime }) => {
  return (
    <>
      <span className='md:md:text-lg text-md'>
        <em className='dark:text-white text-black not-italic'>Seller name: </em>
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
        <em className='dark:text-white text-black not-italic'>Current bid: </em>
        {auction.currentBid}$
      </span>
      <span className='md:text-lg text-md'>
        <em className='dark:text-white text-black not-italic'>Start date: </em>
        <time dateTime={auction.createdAt.toString()}>
          {formattedStartTime}
        </time>
      </span>
      <span className='md:text-lg text-md'>
        <em className='dark:text-white text-black not-italic'>End date: </em>
        <time dateTime={auction.endTime.toString()}>{formattedEndTime}</time>
      </span>
    </>
  );
};

export default AuctionItemBody;
