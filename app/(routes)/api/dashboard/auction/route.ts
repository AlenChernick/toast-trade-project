import { NextResponse } from 'next/server';
import connectDB from '@/services/db.service';
import { authService } from '@/services/auth.service';
import { Auction } from '@/models/auction.model';
import { cloudinaryService } from '@/services/cloudinary.service';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const userId = formData.get('userId');

    const loggedInUser = await authService.getLoggedInUser();

    if (loggedInUser?._id != userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    await connectDB();

    const itemName = formData.get('itemName');
    const itemImage = formData.get('itemImage');
    const sellerName = formData.get('sellerName');
    const endTime = formData.get('endTime');
    const startingBid = formData.get('startingBid');
    const currentBid = formData.get('currentBid');
    const type = formData.get('type');

    if (itemImage && typeof itemImage === 'object') {
      const buffer = await itemImage.arrayBuffer();

      const cloudinarySecuredURL = await cloudinaryService.uploadToCloudinary(
        buffer
      );

      const newAuction = new Auction({
        userId,
        itemImage: cloudinarySecuredURL,
        sellerName,
        currentBid,
        paymentCompleted: false,
        bids: [],
        itemName,
        endTime,
        startingBid,
        type,
      });

      await newAuction.save();
    } else {
      console.log('No image provided for auction creation.');
    }

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.log('[POST:CREATE-AUCTION]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const formData = await req.formData();
    const userId = formData.get('userId');

    const loggedInUser = await authService.getLoggedInUser();

    if (loggedInUser?._id != userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    await connectDB();

    const itemName = formData.get('itemName');
    const itemImage = formData.get('itemImage');
    const type = formData.get('type');
    const auctionId = formData.get('auctionId');
    let cloudinarySecuredURL;

    if (itemImage && typeof itemImage === 'object') {
      const buffer = await itemImage.arrayBuffer();
      cloudinarySecuredURL = await cloudinaryService.uploadToCloudinary(buffer);
    } else {
      console.log('No image provided for auction creation.');
    }

    try {
      const updatedAuction = {
        itemImage: cloudinarySecuredURL,
        itemName,
        type,
      };

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

    await connectDB();

    try {
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
