import type { FC } from 'react';

const AuctionTimer: FC<{
  isAuctionEnded: boolean;
  hours: number;
  minutes: number;
  seconds: number;
}> = ({ isAuctionEnded, hours, minutes, seconds }) => {
  return (
    <span
      className={`justify-center gap-2 flex-col mt-10 md:text-lg text-md flex items-center space-x-2`}>
      <em className='dark:text-white text-black not-italic md:text-2xl'>
        Time remaining
      </em>
      <time className='flex items-center space-x-1'>
        {isAuctionEnded ? (
          <span className='text-red-500 font-semibold'>Auction ended</span>
        ) : (
          <span className='flex items-center space-x-1'>
            <em className='not-italic md:text-2xl text-lg bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 py-2 px-3 rounded-lg'>
              {hours < 10 ? `0${hours}h` : `${hours}h`}
            </em>
            <em className='not-italic md:text-2xl text-lg bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 py-2 px-3 rounded-lg'>
              {minutes < 10 ? `0${minutes}m` : `${minutes}m`}
            </em>
            <em className='not-italic md:text-2xl text-lg bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 py-2 px-3 rounded-lg'>
              {seconds < 10 ? `0${seconds}s` : `${seconds}s`}
            </em>
          </span>
        )}
      </time>
    </span>
  );
};

export default AuctionTimer;
