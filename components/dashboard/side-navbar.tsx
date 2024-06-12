import type { FC } from 'react';
import { DashboardActionType } from '@/enum';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CirclePlus, Columns3 } from 'lucide-react';
import Link from 'next/link';

const SideNavbar: FC<{
  isEdit: boolean;
  type: string | string[] | undefined;
}> = ({ isEdit, type }) => {
  return (
    <section className='flex w-full border-b-2 md:w-44 md:border-r-2 md:border-b-0 border-primary pb-2 mb-2 md:mr-5'>
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
        </div>
      </nav>
    </section>
  );
};

export default SideNavbar;
