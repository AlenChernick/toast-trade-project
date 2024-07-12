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
import SkeletonCardForm from '@/components/loaders/skeleton-card-form';

const UserDashboard: NextPage<{
  params: { userId: string };
  searchParams: { [key: string]: string | string[] | undefined };
}> = async ({ params, searchParams }) => {
  const { userId } = params;
  const { type, auctionId } = searchParams;
  const loggedInUser = (await authService.getLoggedInUser()) as JwtUser;
  const isEdit = auctionId !== undefined;
  const DashboardActionTypesArray = Object.values(DashboardActionType);
  const isValidType = DashboardActionTypesArray.includes(
    type as DashboardActionType
  );
  let auction: AuctionType | undefined;
  let isUserHaveActiveAuctionsOrBids: boolean | undefined;

  if (userId !== loggedInUser?._id) return notFound();

  const sellerName = `${loggedInUser.firstName} ${loggedInUser.lastName}`;

  if (!isValidType && type !== undefined) {
    return notFound();
  }

  if (isEdit) {
    auction = await auctionService.getUserAuction(userId, auctionId);
    if (!auction) return notFound();
  }

  if (type === DashboardActionType.Settings) {
    isUserHaveActiveAuctionsOrBids =
      await auctionService.checkUserActiveAuctionsOrBids(userId);
    if (isUserHaveActiveAuctionsOrBids === undefined) return notFound();
  }

  return (
    <section className='flex flex-col md:flex-row md:h-[45rem]'>
      <SideNavbar isEdit={isEdit} type={type} userId={userId} />
      {type === DashboardActionType.CreateOrEditAuction && (
        <Suspense
          key={DashboardActionType.CreateOrEditAuction}
          fallback={<SkeletonCardForm />}>
          <CreateOrEditAuction
            userId={userId}
            sellerName={sellerName}
            auction={auction}
          />
        </Suspense>
      )}
      {type === DashboardActionType.Auctions && (
        <Suspense
          key={DashboardActionType.Auctions}
          fallback={<SkeletonCardsLoader />}>
          <UserAuctions userId={userId} />
        </Suspense>
      )}
      {type === DashboardActionType.Bids && (
        <Suspense
          key={DashboardActionType.Bids}
          fallback={<SkeletonCardsLoader />}>
          <UserBids userId={userId} loggedInUser={loggedInUser} />
        </Suspense>
      )}
      {type === DashboardActionType.Settings && (
        <Suspense
          key={DashboardActionType.Settings}
          fallback={<SkeletonCardForm />}>
          <UserSettings
            loggedInUser={loggedInUser}
            isUserHaveActiveAuctionsOrBids={isUserHaveActiveAuctionsOrBids}
          />
        </Suspense>
      )}
    </section>
  );
};

export default UserDashboard;
