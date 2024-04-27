import AuctionsList from '@/components/dashboard/auctions-list';
import CreateOrEditAuction from '@/components/dashboard/create-edit-auction';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AuctionActionType } from '@/enum';
import { getLoggedInUser } from '@/services/auth.service';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAuction } from '@/services/auction.service';
import type { AuctionType } from '@/models/auction.model';

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
    auction = await getAuction(userId, auctionId);
    if (!auction) return notFound();
  }
  const sellerName = `${loggedInUser.firstName} ${loggedInUser.lastName}`;

  return (
    <section className='flex'>
      <section className='md:w-44 w-52'>
        <nav>
          <ScrollArea>
            <div className='flex flex-col gap-2'>
              <Link
                href={`?type=${AuctionActionType.CreateOrEditAuction}`}
                title='Create auction'
                className={`${
                  type === AuctionActionType.CreateOrEditAuction
                    ? 'text-active'
                    : 'text-white'
                }`}>
                Create auction
              </Link>
              <Link
                href={`?type=${AuctionActionType.AuctionsList}`}
                className={`${
                  type === AuctionActionType.AuctionsList
                    ? 'text-active'
                    : 'text-white'
                }`}>
                Auctions list
              </Link>
            </div>
          </ScrollArea>
        </nav>
      </section>
      {type === 'auctionList' && <AuctionsList userId={userId} />}
      {type === 'createOrEditAuction' && (
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
