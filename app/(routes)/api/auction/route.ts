import { Auction, type UserBid } from '@/models/auction.model';
import { getLoggedInUser } from '@/services/auth.service';
import { NextResponse } from 'next/server';
import connectDB from '@/services/db.service';

export async function PATCH(req: Request) {
  try {
    const {
      newBidValue,
      userId,
      auctionCreatorId,
      firstName,
      lastName,
      auctionId,
      auctionBids,
      isAuctionEnded,
    } = await req.json();

    if (isAuctionEnded) {
      return new NextResponse('Auction has ended', { status: 400 });
    }

    const loggedInUser = await getLoggedInUser();

    if (loggedInUser?._id != userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (auctionCreatorId === userId) {
      return new NextResponse('Cannot add bit your own auction', {
        status: 403,
      });
    }

    await connectDB();

    try {
      const newBid: UserBid = {
        userId,
        firstName,
        lastName,
        bid: newBidValue,
        createdAt: new Date(),
      };

      auctionBids.push(newBid);

      const updatedAuction = {
        currentBid: newBidValue,
        bids: auctionBids,
      };

      await Auction.findByIdAndUpdate(auctionId, updatedAuction);
      console.log('Added new bid successfully.');
      return new NextResponse(null, { status: 200 });
    } catch (error) {
      console.error('Error adding new bid:', error);
      return new NextResponse('Auction not found.', { status: 404 });
    }
  } catch (error) {
    console.log('[PATCH:ADD-BID]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}