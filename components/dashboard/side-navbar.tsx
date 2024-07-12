import type { FC } from 'react';
import { AppRoutes, DashboardActionType } from '@/enum';
import {
  CirclePlus,
  Columns3,
  UserRoundCog,
  SquareActivity,
  LayoutDashboard,
} from 'lucide-react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import Link from 'next/link';

const SideNavbar: FC<{
  isEdit: boolean;
  type: string | string[] | undefined;
  userId: string;
}> = ({ isEdit, type, userId }) => {
  return (
    <ScrollArea
      className='overflow-x-hidden h-14 md:h-auto whitespace-nowrap flex border-b-2
     md:min-w-52 md:border-r-2 md:border-b-0
      border-primary mb-4 md:-mx-4 md:mr-5'>
      <nav className='flex flex-row md:flex-col gap-5 md:gap-2'>
        <Link
          href={`${AppRoutes.Dashboard}/${userId}`}
          title='Dashboard'
          className={`${
            type === undefined ? 'nav-active' : 'side-nav-text'
          } flex gap-2 items-center`}>
          <LayoutDashboard className='w-4 h-4' />
          Dashboard
        </Link>
        <Link
          href={`?type=${DashboardActionType.Auctions}`}
          title='User auctions'
          className={`${
            type === DashboardActionType.Auctions
              ? 'nav-active'
              : 'side-nav-text'
          } flex gap-2 items-center`}>
          <Columns3 className='w-4 h-4' />
          Auctions
        </Link>
        <Link
          href={`?type=${DashboardActionType.Bids}`}
          title='User bids'
          className={`${
            type === DashboardActionType.Bids ? 'nav-active' : 'side-nav-text'
          } flex gap-2 items-center`}>
          <SquareActivity className='w-4 h-4' />
          Bids
        </Link>
        <Link
          href={`?type=${DashboardActionType.CreateOrEditAuction}`}
          title={`${isEdit ? 'Edit' : 'Create'} auction`}
          className={`${
            type === DashboardActionType.CreateOrEditAuction
              ? 'nav-active'
              : 'side-nav-text'
          } flex gap-2 items-center`}>
          <CirclePlus className='w-4 h-4' />
          {`${isEdit ? 'Edit' : 'Create'} auction`}
        </Link>
        <hr className='hidden md:block border-b-primary border-2 w-full my-1' />
        <Link
          href={`?type=${DashboardActionType.Settings}`}
          title='User settings'
          className={`${
            type === DashboardActionType.Settings
              ? 'nav-active'
              : 'side-nav-text'
          } flex gap-2 items-center`}>
          <UserRoundCog className='w-4 h-4' />
          Settings
        </Link>
      </nav>
      <ScrollBar orientation='horizontal' />
    </ScrollArea>
  );
};

export default SideNavbar;
