import { AuctionType } from '@/models/auction.model';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getTimeVariables = (duration: number) => {
  const hours = Math.floor(duration / (1000 * 60 * 60));
  const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((duration % (1000 * 60)) / 1000);

  return { hours, minutes, seconds };
};

export function getFormattedDateTimeString(date: Date) {
  return `${date.toDateString()} ${date.getHours()}:${date.getMinutes()}`;
}

export const convertToSubCurrency = (amount: number, factor = 100) => {
  return Math.round(amount * factor);
};

export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const calculateTimeRemaining = (endTime: Date): number => {
  return Math.max(0, endTime.getTime() - Date.now());
};

export const calculateRemainingTimes = (auctions: AuctionType[]): number[] => {
  const now = Date.now();
  return auctions.map((auction) => {
    const auctionEndTime = new Date(auction.endTime);
    const duration = auctionEndTime.getTime() - now;
    return duration > 0 ? duration : 0;
  });
};
