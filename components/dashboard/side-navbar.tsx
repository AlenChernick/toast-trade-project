import type { FC } from 'react';
import { DashboardActionType } from '@/enum';
import { CirclePlus, Columns3, UserRoundCog } from 'lucide-react';
import Link from 'next/link';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';

const SideNavbar: FC<{
  isEdit: boolean;
  type: string | string[] | undefined;
}> = ({ isEdit, type }) => {
  return (
    <ScrollArea className='h-9 md:h-auto whitespace-nowrap flex border-b-2 md:w-44 md:border-r-2 md:border-b-0 border-primary pb-2 mb-2 md:mr-5'>
      <section>
        <nav>
          <div className='flex flex-row md:flex-col gap-5 md:gap-2'>
            <Link
              href={`?type=${DashboardActionType.CreateOrEditAuction}`}
              title={`${isEdit ? 'Edit' : 'Create'} auction`}
              className={`${
                type === DashboardActionType.CreateOrEditAuction
                  ? 'text-active'
                  : 'dark:text-white text-black'
              } flex gap-2 items-center`}>
              <CirclePlus className='w-4 h-4' />
              {`${isEdit ? 'Edit' : 'Create'} auction`}
            </Link>
            <Link
              href={`?type=${DashboardActionType.UserAuctions}`}
              className={`${
                type === DashboardActionType.UserAuctions
                  ? 'text-active'
                  : 'dark:text-white text-black'
              } flex gap-2 items-center`}>
              <Columns3 className='w-4 h-4' />
              Your auctions
            </Link>
            <Link
              href={`?type=${DashboardActionType.UserSettings}`}
              className={`${
                type === DashboardActionType.UserSettings
                  ? 'text-active'
                  : 'dark:text-white text-black'
              } flex gap-2 items-center`}>
              <UserRoundCog className='w-4 h-4' />
              User settings
            </Link>
          </div>
        </nav>
      </section>
      <ScrollBar orientation='horizontal' />
    </ScrollArea>
  );
};

export default SideNavbar;
