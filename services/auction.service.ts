import 'server-only';
import { getLoggedInUser } from '@/services/auth.service';
import { Auction, type AuctionType } from '@/models/auction.model';
import connectDB from '@/services/db.service';

export async function getAuctionsList(userId: string) {
  try {
    const loggedInUser = await getLoggedInUser();

    if (loggedInUser?._id !== userId) {
      throw new Error('Unauthorized');
    }

    await connectDB();

    const auctions: AuctionType[] = await Auction.find({ userId }).lean();

    if (!auctions) {
      throw new Error('Failed to get auctions');
    }

    return auctions;
  } catch (error) {
    console.error((error as Error).message);
  }
}

export async function getAuction(
  userId: string,
  auctionId: string | string[] | undefined
) {
  try {
    const loggedInUser = await getLoggedInUser();

    if (loggedInUser?._id !== userId) {
      throw new Error('Unauthorized');
    }

    await connectDB();

    const auction: AuctionType | null = await Auction.findOne({
      _id: auctionId,
      userId: userId,
    }).lean();

    if (auction) {
      auction._id = auction._id.toString();
      return auction;
    } else {
      throw new Error('Failed to get auction');
    }
  } catch (error) {
    console.error((error as Error).message);
  }
}

export async function getLatestAuctions() {
  try {
    await connectDB();

    const currentTime = new Date();

    const auctions: AuctionType[] = await Auction.find({
      endTime: { $gt: currentTime },
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    if (!auctions) {
      throw new Error('Failed to get auctions');
    }

    const plainAuctions = auctions.map((auction) => {
      return {
        ...auction,
        _id: auction._id.toString(),
      };
    });

    return plainAuctions;
  } catch (error) {
    console.error((error as Error).message);
  }
}
