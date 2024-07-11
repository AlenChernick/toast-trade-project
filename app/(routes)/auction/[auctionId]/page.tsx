import type { AuctionType } from '@/models/auction.model';
import { authService } from '@/services/auth.service';
import { auctionService } from '@/services/auction.service';
import { notFound } from 'next/navigation';
import AuctionItem from '@/components/auction/auction-item';

const Auction = async ({ params }: { params: { auctionId: string } }) => {
  const { auctionId } = params;
  const loggedInUser = await authService.getLoggedInUser();
  const auction: AuctionType | undefined = await auctionService.getAuction(
    auctionId
  );

  if (!auction) return notFound();

  return <AuctionItem auction={auction} loggedInUser={loggedInUser} />;
};

export default Auction;
