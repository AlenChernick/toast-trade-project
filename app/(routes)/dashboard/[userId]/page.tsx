import type { AuctionType } from '@/models/auction.model';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DashboardActionType } from '@/enum';
import { getLoggedInUser } from '@/services/auth.service';
import { notFound } from 'next/navigation';
import { getUserAuction } from '@/services/auction.service';
import { Suspense } from 'react';
import { CirclePlus, Columns3 } from 'lucide-react';
import UserAuctions from '@/components/dashboard/user-auctions';
import CreateOrEditAuction from '@/components/dashboard/create-edit-auction';
import SkeletonCardsLoader from '@/components/loaders/skeleton-cards-loader';
import Link from 'next/link';

const UserDashboard = async ({
  params,
  searchParams,
}: {
  params: { userId: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const { userId } = params;
  const { type, auctionId } = searchParams;
  const loggedInUser = await getLoggedInUser();
  const isEdit = auctionId !== undefined;
  let auction: AuctionType | undefined;

  if (userId !== loggedInUser?._id) return notFound();

  if (isEdit) {
    auction = await getUserAuction(userId, auctionId);
    if (!auction) return notFound();
  }
  const sellerName = `${loggedInUser.firstName} ${loggedInUser.lastName}`;

  return (
    <section className='flex'>
      <section className='md:w-44 w-72'>
        <nav>
          <ScrollArea>
            <div className='flex flex-col gap-2'>
              <Link
                href={`?type=${DashboardActionType.CreateOrEditAuction}`}
                title={`${isEdit ? 'Edit' : 'Create'} auction`}
                className={`${
                  type === DashboardActionType.CreateOrEditAuction
                    ? 'text-active'
                    : 'dark:text-white text-black'
                } flex gap-1 items-center`}>
                <CirclePlus className='w-4 h-4' />
                {`${isEdit ? 'Edit' : 'Create'} auction`}
              </Link>
              <Link
                href={`?type=${DashboardActionType.UserAuctions}`}
                className={`${
                  type === DashboardActionType.UserAuctions
                    ? 'text-active'
                    : 'dark:text-white text-black'
                } flex gap-1 items-center`}>
                <Columns3 className='w-4 h-4' />
                Your auctions
              </Link>
            </div>
          </ScrollArea>
        </nav>
      </section>
      {type === DashboardActionType.UserAuctions && (
        <Suspense key={type} fallback={<SkeletonCardsLoader />}>
          <UserAuctions userId={userId} />
        </Suspense>
      )}
      {type === DashboardActionType.CreateOrEditAuction && (
        <CreateOrEditAuction
          userId={userId}
          sellerName={sellerName}
          auction={auction}
        />
      )}
    </section>
  );
};

export default UserDashboard;
