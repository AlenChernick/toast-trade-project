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
  );
};

export default SideNavbar;
