import type { AuctionType } from '@/models/auction.model';
import type { NextPage } from 'next';
import { DashboardActionType } from '@/enum';
import { getLoggedInUser } from '@/services/auth.service';
import { notFound } from 'next/navigation';
import { getUserAuction } from '@/services/auction.service';
import { Suspense } from 'react';
import UserAuctions from '@/components/dashboard/user-auctions';
import CreateOrEditAuction from '@/components/dashboard/create-edit-auction';
import SkeletonCardsLoader from '@/components/loaders/skeleton-cards-loader';
import SideNavbar from '@/components/dashboard/side-navbar';

const UserDashboard: NextPage<{
  params: { userId: string };
  searchParams: { [key: string]: string | string[] | undefined };
}> = async ({ params, searchParams }) => {
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
    <section className='flex flex-col md:flex-row'>
      <SideNavbar isEdit={isEdit} type={type} />
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
