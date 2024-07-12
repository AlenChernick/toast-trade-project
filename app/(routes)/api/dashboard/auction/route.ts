import { NextResponse } from 'next/server';
import connectDB from '@/services/db.service';
import { authService } from '@/services/auth.service';
import { Auction, AuctionType } from '@/models/auction.model';
import { cloudinaryService } from '@/services/cloudinary.service';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const userId = formData.get('userId');
    const auctionName = formData.get('auctionName');
    const itemImage = formData.get('itemImage');
    const sellerName = formData.get('sellerName');
    const endTime = formData.get('endTime');
    const startingBid = formData.get('startingBid');
    const currentBid = formData.get('currentBid');
    const type = formData.get('type');
    let cloudinarySecuredURL;

    const loggedInUser = await authService.getLoggedInUser();

    if (loggedInUser?._id != userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    await connectDB();

    const existingAuctionName: AuctionType | null = await Auction.findOne({
      auctionName,
    });

    if (existingAuctionName) {
      return new NextResponse('Auction name already exists', { status: 400 });
    }

    if (itemImage && typeof itemImage === 'object') {
      const buffer = await itemImage.arrayBuffer();

      cloudinarySecuredURL = await cloudinaryService.uploadToCloudinary(buffer);
    } else {
      console.log('No image provided for auction creation.');
    }

    try {
      const newAuction = new Auction({
        userId,
        itemImage: cloudinarySecuredURL,
        sellerName,
        currentBid,
        auctionName,
        endTime,
        startingBid,
        type,
      });
      await newAuction.save();
      console.log('Auction created successfully.');
      return new NextResponse(null, { status: 200 });
    } catch (error) {
      console.error('Error creating auction:', error);
      return new NextResponse('Auction not found.', { status: 404 });
    }
  } catch (error) {
    console.log('[POST:CREATE-AUCTION]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const formData = await req.formData();
    const userId = formData.get('userId');
    const auctionName = formData.get('auctionName');
    const itemImage = formData.get('itemImage');
    const type = formData.get('type');
    const auctionId = formData.get('auctionId');
    const auctionImageUrl = formData.get('auctionImageUrl') as string;
    let cloudinarySecuredURL;

    const loggedInUser = await authService.getLoggedInUser();

    if (loggedInUser?._id != userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    await connectDB();

    const existingAuctionName: AuctionType | null = await Auction.findOne({
      auctionName,
    });

    if (existingAuctionName) {
      return new NextResponse('Auction name already exists', { status: 400 });
    }

    if (itemImage && typeof itemImage === 'object' && auctionImageUrl) {
      const buffer = await itemImage.arrayBuffer();

      if (auctionImageUrl) {
        await cloudinaryService.deleteFromCloudinary(auctionImageUrl);
      }

      cloudinarySecuredURL = await cloudinaryService.uploadToCloudinary(buffer);
    }

    try {
      const updatedAuction = {
        itemImage: cloudinarySecuredURL,
        auctionName,
        type,
      };

      await connectDB();
      await Auction.findByIdAndUpdate(auctionId, updatedAuction);
      console.log('Auction updated successfully.');
      return new NextResponse(null, { status: 200 });
    } catch (error) {
      console.error('Error updating auction:', error);
      return new NextResponse('Auction not found.', { status: 404 });
    }
  } catch (error) {
    console.log('[PATCH:UPDATE-AUCTION]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const auctionId = searchParams.get('auctionId');
    const auctionHasBidsString = searchParams.get('auctionHasBids');
    const auctionImageUrl = searchParams.get('auctionImageUrl');
    const auctionHasBids = auctionHasBidsString === 'true';

    const loggedInUser = await authService.getLoggedInUser();

    if (loggedInUser?._id != userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (auctionHasBids) {
      return new NextResponse(
        'Cannot delete auction as it has existing bids.',
        { status: 400 }
      );
    }

    if (auctionImageUrl) {
      await cloudinaryService.deleteFromCloudinary(auctionImageUrl);
    }

    try {
      await connectDB();
      await Auction.findByIdAndDelete(auctionId);
      console.log('Auction deleted successfully.');
      return new NextResponse(null, { status: 200 });
    } catch (error) {
      console.error('Error deleting auction:', error);
      return new NextResponse('Auction not found.', { status: 404 });
    }
  } catch (error) {
    console.log('[DELETE:DELETE-AUCTION]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
