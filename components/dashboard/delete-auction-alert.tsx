'use client';
import { type FC, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ApiRoutes } from '@/enum';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const DeleteAuctionAlert: FC<{
  userId: string;
  auctionId: string;
  auctionHasBids: boolean;
  auctionImageUrl: string;
}> = ({ userId, auctionId, auctionHasBids, auctionImageUrl }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleDeleteAuction = async () => {
    try {
      setIsLoading(true);

      if (auctionHasBids) {
        toast.error('Cannot delete an auction with bids.');
        return;
      }

      const response = await fetch(
        `${ApiRoutes.DashboardAuction}?userId=${userId}&auctionId=${auctionId}&auctionHasBids=${auctionHasBids}&auctionImageUrl=${auctionImageUrl}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        toast.error('Failed to delete the auction.');
        throw new Error('Failed to delete the auction');
      }

      toast.success(`Auction deleted successfully.`);
      router.refresh();
    } catch (error) {
      setIsLoading(false);
      toast.error('Something went wrong.');
      console.error((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <section className='flex items-center justify-center'>
      <AlertDialog>
        <AlertDialogTrigger
          disabled={isLoading}
          className='inline-flex items-center justify-center whitespace-nowrap
           rounded-md text-sm font-medium ring-offset-background
            transition-colors focus-visible:outline-none focus-visible:ring-
            2 focus-visible:ring-ring focus-visible:ring-offset-2
             disabled:pointer-events-none disabled:opacity-50
              bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2'>
          Delete
        </AlertDialogTrigger>
        <AlertDialogContent className='w-11/12'>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              auction and remove its data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className='gap-2 md:gap-0'>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={isLoading}
              onClick={handleDeleteAuction}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
};

export default DeleteAuctionAlert;
