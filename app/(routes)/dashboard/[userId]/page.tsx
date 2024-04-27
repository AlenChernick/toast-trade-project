import CreateOrEditAuction from '@/components/dashboard/create-edit-auction';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AuctionActionType } from '@/enum';
import { getLoggedInUser } from '@/services/auth.service';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const UserDashboard = async ({
  params,
  searchParams,
}: {
  params: { userId: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const type = searchParams.type;
  const { userId } = params;
  const loggedInUser = await getLoggedInUser();

  if (userId !== loggedInUser?._id) return notFound();

  const sellerName = `${loggedInUser.firstName} ${loggedInUser.lastName}`;

  return (
    <section className='flex'>
      <section className='md:w-44 w-52'>
        <nav>
          <ScrollArea>
            <div className='flex flex-col gap-2'>
              <Link
                href={`?type=${AuctionActionType.CreateAuction}`}
                title='Create auction'
                className={`${
                  type === AuctionActionType.CreateAuction
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
      {type === 'createAuction' && (
        <CreateOrEditAuction
          userId={loggedInUser._id}
          sellerName={sellerName}
        />
      )}
    </section>
  );
};

export default UserDashboard;
