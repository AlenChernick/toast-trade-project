import { Schema, model, models } from 'mongoose';

export type AuctionType = {
  _id: string;
  userId: string;
  itemName: string;
  itemImage: string;
  sellerName: string;
  startingBid: number;
  currentBid: number;
  endTime: Date;
  type: string;
  createdAt: Date;
  updatedAt: Date;
};

const AuctionSchema = new Schema<AuctionType>(
  {
    userId: {
      type: String,
      required: true,
    },
    itemName: {
      type: String,
      required: true,
    },
    itemImage: {
      type: String,
      required: true,
    },
    sellerName: {
      type: String,
      required: true,
    },
    startingBid: {
      type: Number,
      required: true,
    },
    currentBid: {
      type: Number,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Auction =
  models.Auction || model<AuctionType>('Auction', AuctionSchema);
