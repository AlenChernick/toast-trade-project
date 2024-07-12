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
    const currentTime = new Date();

    await connectDB();

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

const getUserAuctionsBids = async (userId: string) => {
  try {
    const loggedInUser = await authService.getLoggedInUser();

    if (loggedInUser?._id !== userId) {
      throw new Error('Unauthorized');
    }

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

const getUserActiveAuctions = async (
  userId: string
): Promise<AuctionType[]> => {
  try {
    const loggedInUser = await authService.getLoggedInUser();

    if (loggedInUser?._id !== userId) {
      throw new Error('Unauthorized');
    }

    const currentTime = new Date();

    await connectDB();

    const activeAuctions: AuctionType[] = await Auction.find({
      userId,
      endTime: { $gt: currentTime },
    }).lean();

    return activeAuctions;
  } catch (error) {
    console.error((error as Error).message);
    throw new Error('Failed to get active auctions for user');
  }
};

const getUserActiveBids = async (userId: string): Promise<AuctionType[]> => {
  try {
    const loggedInUser = await authService.getLoggedInUser();

    if (loggedInUser?._id !== userId) {
      throw new Error('Unauthorized');
    }

    const currentTime = new Date();

    await connectDB();

    const userActiveBids: AuctionType[] = await Auction.find({
      bids: { $elemMatch: { userId } },
      endTime: { $gt: currentTime },
    }).lean();

    return userActiveBids;
  } catch (error) {
    console.error((error as Error).message);
    throw new Error('Failed to get active auctions with user bids');
  }
};

const checkUserActiveAuctionsOrBids = async (
  userId: string
): Promise<boolean> => {
  try {
    const loggedInUser = await authService.getLoggedInUser();

    if (loggedInUser?._id !== userId) {
      throw new Error('Unauthorized');
    }

    const [userActiveAuctions, userActiveBids] = await Promise.all([
      getUserActiveAuctions(userId),
      getUserActiveBids(userId),
    ]);

    const isUserHaveActiveAuctionsOrBids =
      userActiveAuctions.length > 0 || userActiveBids.length > 0;

    return isUserHaveActiveAuctionsOrBids;
  } catch (error) {
    console.error((error as Error).message);
    throw new Error('Failed to check for user active auctions or bids');
  }
};

export const auctionService = {
  getUserAuctions,
  getUserAuction,
  getAuction,
  getLatestAuctions,
  getUserAuctionsBids,
  checkUserActiveAuctionsOrBids,
};
