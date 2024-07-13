import { Schema, model, models, Types } from 'mongoose';

export type AuctionType = {
  _id: string;
  userId: string;
  auctionName: string;
  itemImage: string;
  sellerName: string;
  startingBid: number;
  currentBid: number;
  paymentCompleted: boolean;
  paymentIntentId: string;
  bids: UserBid[];
  type: string;
  endTime: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type UserBid = {
  _id?: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  bid: number;
  createdAt: Date;
};

const BidSchema = new Schema<UserBid>({
  _id: {
    type: Schema.Types.ObjectId,
    default: () => new Types.ObjectId(),
  },
  userId: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  bid: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
});

const AuctionSchema = new Schema<AuctionType>(
  {
    userId: {
      type: String,
      required: true,
    },
    auctionName: {
      type: String,
      required: true,
      unique: true,
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
      default: false,
    },
    paymentIntentId: {
      type: String,
      default: '',
    },
    bids: {
      type: [BidSchema],
      default: [],
    },
    type: {
      type: String,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true, strict: false }
);

export const Auction =
  models?.Auction || model<AuctionType>('Auction', AuctionSchema);
