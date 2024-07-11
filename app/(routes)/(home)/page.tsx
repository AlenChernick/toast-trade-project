import type { NextPage } from 'next';
import { auctionService } from '@/services/auction.service';
import { AuctionType } from '@/models/auction.model';
import LatestAuctionsCarousel from '@/components/home/latest-auctions-carousel';

const Home: NextPage = async () => {
  const latestAuctions: AuctionType[] | undefined =
    await auctionService.getLatestAuctions();

  return (
    <section className='flex flex-col gap-5 items-center md:justify-between md:px-24 px-0'>
      <h1 className='md:text-3xl text-lg font-semibold text-center border-b-4 pb-2 border-primary'>
        Welcome to ToastTrade: Where Every Sip Tells a Story!
      </h1>
      <section className='w-full'>
        {latestAuctions?.length ? (
          <>
            <h2 className='md:text-2xl text-lg ml-4 mb-3'>Latest auctions</h2>
            <LatestAuctionsCarousel latestAuctions={latestAuctions} />
          </>
        ) : (
          <p>No auctions found</p>
        )}
      </section>
    </section>
  );
};

export default Home;
