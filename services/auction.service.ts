import 'server-only';
import { authService } from '@/services/auth.service';
import { Auction, type AuctionType } from '@/models/auction.model';
import connectDB from '@/services/db.service';

const getUserAuctions = async (userId: string) => {
  try {
    const loggedInUser = await authService.getLoggedInUser();

    if (loggedInUser?._id !== userId) {
      throw new Error('Unauthorized');
    }

    await connectDB();

    const auctions: AuctionType[] = await Auction.find({ userId }).lean();

    if (auctions) {
      const parsedAuctions = JSON.parse(JSON.stringify(auctions));
      return parsedAuctions;
    } else {
      throw new Error('Failed to get auctions');
    }
  } catch (error) {
    console.error((error as Error).message);
  }
};

const getUserAuction = async (
  userId: string,
  auctionId: string | string[] | undefined
) => {
  try {
    const loggedInUser = await authService.getLoggedInUser();

    if (loggedInUser?._id !== userId) {
      throw new Error('Unauthorized');
    }

    await connectDB();

    const auction: AuctionType | null = await Auction.findOne({
      _id: auctionId,
      userId: userId,
    });

    if (auction) {
      const parsedAuction = JSON.parse(JSON.stringify(auction));
      return parsedAuction;
    } else {
      throw new Error('Failed to get user auction');
    }
  } catch (error) {
    console.error((error as Error).message);
  }
};

const getAuction = async (auctionId: string) => {
  try {
    await connectDB();

    const auction: AuctionType | null = await Auction.findOne({
      _id: auctionId,
    }).lean();

    if (auction) {
      const parsedAuction = JSON.parse(JSON.stringify(auction));
      return parsedAuction;
    } else {
      throw new Error('Failed to get auction');
    }
  } catch (error) {
    console.error((error as Error).message);
  }
};

const getLatestAuctions = async () => {
  try {
    await connectDB();

    const currentTime = new Date();

    const auctions: AuctionType[] = await Auction.find({
      endTime: { $gt: currentTime },
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    if (auctions) {
      const parsedAuctions = JSON.parse(JSON.stringify(auctions));
      return parsedAuctions;
    } else {
      throw new Error('Failed to get auctions');
    }
  } catch (error) {
    console.error((error as Error).message);
  }
};

const getUserBidsAuctions = async (userId: string) => {
  try {
    await connectDB();

    const userBidsAuctions: AuctionType[] = await Auction.find({
      bids: { $elemMatch: { userId: userId } },
    }).lean();

    if (userBidsAuctions) {
      const parsedUserBidsAuctions = JSON.parse(
        JSON.stringify(userBidsAuctions)
      );
      return parsedUserBidsAuctions;
    } else {
      throw new Error('Failed to get user bids auctions');
    }
  } catch (error) {
    console.error((error as Error).message);
  }
};

getUserBidsAuctions('662bf98a068d66ec0cfeb132');

export const auctionService = {
  getUserAuctions,
  getUserAuction,
  getAuction,
  getLatestAuctions,
  getUserBidsAuctions,
};
