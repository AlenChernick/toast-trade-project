import type { NextPage } from 'next';
import type { JwtUser } from '@/models/user.model';
import type { AuctionType } from '@/models/auction.model';
import { DashboardActionType } from '@/enum';
import { authService } from '@/services/auth.service';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { auctionService } from '@/services/auction.service';
import UserAuctions from '@/components/dashboard/user-auctions';
import UserBids from '@/components/dashboard/user-bids';
import CreateOrEditAuction from '@/components/dashboard/create-edit-auction';
import SideNavbar from '@/components/dashboard/side-navbar';
import UserSettings from '@/components/dashboard/user-settings';
import SkeletonCardsLoader from '@/components/loaders/skeleton-cards-loader';
import SkeletonUserSettings from '@/components/loaders/skeleton-user-settings';

const UserDashboard: NextPage<{
  params: { userId: string };
  searchParams: { [key: string]: string | string[] | undefined };
}> = async ({ params, searchParams }) => {
  const { userId } = params;
  const { type, auctionId } = searchParams;
  const loggedInUser = (await authService.getLoggedInUser()) as JwtUser;
  const isEdit = auctionId !== undefined;
  let auction: AuctionType | undefined;

  if (userId !== loggedInUser?._id) return notFound();

  if (isEdit) {
    auction = await auctionService.getUserAuction(userId, auctionId);
    if (!auction) return notFound();
  }

  const sellerName = `${loggedInUser.firstName} ${loggedInUser.lastName}`;

  return (
    <section className='flex flex-col md:flex-row'>
      <SideNavbar isEdit={isEdit} type={type} />
      {type === DashboardActionType.CreateOrEditAuction && (
        <CreateOrEditAuction
          userId={userId}
          sellerName={sellerName}
          auction={auction}
        />
      )}
      {type === DashboardActionType.UserAuctions && (
        <Suspense
          key={DashboardActionType.UserAuctions}
          fallback={<SkeletonCardsLoader />}>
          <UserAuctions userId={userId} />
        </Suspense>
      )}
      {type === DashboardActionType.UserBids && (
        <Suspense
          key={DashboardActionType.UserBids}
          fallback={<SkeletonCardsLoader />}>
          <UserBids userId={userId} />
        </Suspense>
      )}
      {type === DashboardActionType.UserSettings && (
        <Suspense
          key={DashboardActionType.UserSettings}
          fallback={<SkeletonUserSettings />}>
          <UserSettings loggedInUser={loggedInUser} />
        </Suspense>
      )}
    </section>
  );
};

export default UserDashboard;
