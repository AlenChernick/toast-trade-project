import type { AuctionType } from '@/models/auction.model';
import type { FC } from 'react';
import { AuctionStatus } from '@/enum';

const AuctionBody: FC<{
  auction: AuctionType;
  formattedStartTime: string;
  formattedEndTime: string;
  isAuctionActive: boolean;
  isPaymentCompleted: boolean;
}> = ({
  auction,
  formattedStartTime,
  formattedEndTime,
  isAuctionActive,
  isPaymentCompleted,
}) => {
  return (
    <>
      <span className='border-b-2 pb-1'>
        Auction seller: {auction.sellerName}
      </span>
      <span className='border-b-2 pb-1'>Alcohol type: {auction.type}</span>
      <span className='border-b-2 pb-1'>
        Starting bid: {auction.startingBid}$
      </span>
      <span className='border-b-2 pb-1'>
        Current bid: {auction.currentBid}$
      </span>
      <time className='border-b-2 pb-1' dateTime={auction.createdAt.toString()}>
        Start date: {formattedStartTime}
      </time>
      <time className='border-b-2 pb-1' dateTime={auction.endTime.toString()}>
        End date: {formattedEndTime}
      </time>
      <span className='border-b-2 pb-1'>
        Status:{' '}
        {isAuctionActive ? (
          <em className='not-italic text-green-400'>{AuctionStatus.Active}</em>
        ) : !isAuctionActive && !isPaymentCompleted ? (
          <em className='not-italic text-primary'>
            {AuctionStatus.AwaitingPayment}
          </em>
        ) : (
          <em className='not-italic text-green-200'>
            {AuctionStatus.Completed}
          </em>
        )}
      </span>
    </>
  );
};

export default AuctionBody;
