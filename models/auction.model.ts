import { Schema, model, models, Types } from 'mongoose';

export type AuctionType = {
  _id: string;
  userId: string;
  itemName: string;
  itemImage: string;
  sellerName: string;
  startingBid: number;
  currentBid: number;
  paymentCompleted: boolean;
  type: string;
  bids: UserBid[];
  endTime: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type UserBid = {
  _id?: string;
  userId: string;
  firstName: string;
  lastName: string;
  bid: number;
  createdAt: Date;
};

const BidSchema = new Schema<UserBid>({
  _id: {
    type: Schema.Types.ObjectId,
    default: () => new Types.ObjectId(),
  },
  userId: String,
  firstName: String,
  lastName: String,
  bid: Number,
});

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
    paymentCompleted: {
      type: Boolean,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    bids: {
      type: [BidSchema],
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

export const Auction =
  models?.Auction || model<AuctionType>('Auction', AuctionSchema);
