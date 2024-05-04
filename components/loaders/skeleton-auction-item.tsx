import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

const SkeletonAuctionItem = () => {
  return (
    <section className='w-full'>
      <Card className='py-7'>
        <CardContent className='p-6 pt-0 flex md:flex-row flex-col gap-5'>
          <Skeleton className='md:h-[570px] md:w-[470px] w-full min-h-[273px] md:mb-0 mb-4 ' />
          <div className='flex flex-col gap-2 md:w-1/2 w-full'>
            <Skeleton className='md:text-3xl text-lg break-normal h-8 w-3/4 mb-2' />
            <div className='flex flex-col gap-2'>
              <Skeleton className='md:text-lg text-md h-6 w-full mb-1' />
              <Skeleton className='md:text-lg text-md h-6 w-full mb-1' />
              <Skeleton className='md:text-lg text-md h-6 w-full mb-1' />
              <Skeleton className='md:text-lg text-md h-6 w-full mb-1' />
              <Skeleton className='md:text-lg text-md h-6 w-full mb-1' />
              <Skeleton className='md:text-lg text-md h-6 w-full mb-1' />
              <Skeleton className='md:text-lg text-md h-6 w-full mb-1' />
            </div>
            <div className='justify-center gap-2 flex-col mt-10 md:text-lg text-md flex items-center space-x-2'>
              <Skeleton className='md:text-2xl h-6 w-full mb-1' />
              <Skeleton className='md:text-2xl h-6 w-full mb-1' />
              <Skeleton className='md:text-2xl h-6 w-full mb-1' />
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default SkeletonAuctionItem;
