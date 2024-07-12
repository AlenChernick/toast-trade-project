'use client';
import { type FC, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ApiRoutes, AppRoutes } from '@/enum';
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
import { Button } from '../ui/button';

const DeleteUserAlert: FC<{
  userId: string;
  isUserHaveActiveAuctionsOrBids: boolean | undefined;
}> = ({ userId, isUserHaveActiveAuctionsOrBids }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleDeleteUser = async () => {
    try {
      setIsLoading(true);

      const response = await fetch(`${ApiRoutes.DashboardUser}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          isUserHaveActiveAuctionsOrBids,
        }),
      });

      if (!response.ok) {
        toast.error('Failed to delete the user.');
        throw new Error('Failed to delete the user');
      }

      toast.success(`User deleted successfully.`);
      router.push(AppRoutes.Home);
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
        <AlertDialogTrigger asChild>
          <Button variant='destructive' disabled={isLoading}>
            Delete user
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className='w-11/12'>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {!isUserHaveActiveAuctionsOrBids
                ? 'Are you absolutely sure?'
                : 'Please try again later.'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {!isUserHaveActiveAuctionsOrBids
                ? 'This action cannot be undone. This will permanently delete your user and your data will be removed from our servers.'
                : 'You have active auctions or bids. Please wait for the auctions to end.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className='gap-2 md:gap-0'>
            <AlertDialogCancel disabled={isLoading}>
              {!isUserHaveActiveAuctionsOrBids ? 'Cancel' : 'Continue'}
            </AlertDialogCancel>
            {!isUserHaveActiveAuctionsOrBids && (
              <AlertDialogAction
                disabled={isLoading}
                onClick={handleDeleteUser}>
                Continue
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
};

export default DeleteUserAlert;
