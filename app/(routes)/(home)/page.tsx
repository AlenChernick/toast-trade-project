import type { NextPage } from 'next';

import { getLatestAuctions } from '@/services/auction.service';
import { AuctionType } from '@/models/auction.model';
import LatestAuctionsCarousel from '@/components/home/latest-auctions-carousel';

const Home: NextPage = async () => {
  const latestAuctions: AuctionType[] | undefined = await getLatestAuctions();

  return (
    <section className='flex flex-col items-center md:justify-between md:px-24 px-12'>
      <section className='w-full'>
        <h1 className='text-3xl ml-4 mb-3'>Latest auctions</h1>
        <LatestAuctionsCarousel latestAuctions={latestAuctions} />
      </section>
    </section>
  );
};

export default Home;
