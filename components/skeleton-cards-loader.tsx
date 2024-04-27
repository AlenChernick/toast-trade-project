import { Skeleton } from '@/components/ui/skeleton';

const SkeletonCardsLoader = () => {
  return (
    <section className='grid md:grid-cols-5 gap-4'>
      <div className='w-[320px] bg-card rounded-md'>
        <div className='p-4'>
          <Skeleton className='md:text-base text-xl h-8 w-3/4 mb-2' />
          <Skeleton className='h-6 w-1/2 mb-2' />
          <Skeleton className='h-6 w-3/4 mb-2' />
          <Skeleton className='h-6 w-1/2 mb-2' />
          <Skeleton className='h-6 w-3/4 mb-2' />
          <Skeleton className='h-6 w-1/2 mb-2' />
          <Skeleton className='h-6 w-3/4 mb-2' />
        </div>
        <div className='p-4 py-1'>
          <Skeleton className='object-contain rounded-md h-64 w-full' />
        </div>
        <div className='p-4 flex justify-between'>
          <Skeleton className='w-1/4 h-10' />
          <Skeleton className='w-1/4 h-10' />
        </div>
      </div>
      <div className='w-[320px] bg-card rounded-md'>
        <div className='p-4'>
          <Skeleton className='md:text-base text-xl h-8 w-3/4 mb-2' />
          <Skeleton className='h-6 w-1/2 mb-2' />
          <Skeleton className='h-6 w-3/4 mb-2' />
          <Skeleton className='h-6 w-1/2 mb-2' />
          <Skeleton className='h-6 w-3/4 mb-2' />
          <Skeleton className='h-6 w-1/2 mb-2' />
          <Skeleton className='h-6 w-3/4 mb-2' />
        </div>
        <div className='p-4 py-1'>
          <Skeleton className='object-contain rounded-md h-64 w-full' />
        </div>
        <div className='p-4 flex justify-between'>
          <Skeleton className='w-1/4 h-10' />
          <Skeleton className='w-1/4 h-10' />
        </div>
      </div>
      <div className='w-[320px] bg-card rounded-md'>
        <div className='p-4'>
          <Skeleton className='md:text-base text-xl h-8 w-3/4 mb-2' />
          <Skeleton className='h-6 w-1/2 mb-2' />
          <Skeleton className='h-6 w-3/4 mb-2' />
          <Skeleton className='h-6 w-1/2 mb-2' />
          <Skeleton className='h-6 w-3/4 mb-2' />
          <Skeleton className='h-6 w-1/2 mb-2' />
          <Skeleton className='h-6 w-3/4 mb-2' />
        </div>
        <div className='p-4 py-1'>
          <Skeleton className='object-contain rounded-md h-64 w-full' />
        </div>
        <div className='p-4 flex justify-between'>
          <Skeleton className='w-1/4 h-10' />
          <Skeleton className='w-1/4 h-10' />
        </div>
      </div>
      <div className='w-[320px] bg-card rounded-md'>
        <div className='p-4'>
          <Skeleton className='md:text-base text-xl h-8 w-3/4 mb-2' />
          <Skeleton className='h-6 w-1/2 mb-2' />
          <Skeleton className='h-6 w-3/4 mb-2' />
          <Skeleton className='h-6 w-1/2 mb-2' />
          <Skeleton className='h-6 w-3/4 mb-2' />
          <Skeleton className='h-6 w-1/2 mb-2' />
          <Skeleton className='h-6 w-3/4 mb-2' />
        </div>
        <div className='p-4 py-1'>
          <Skeleton className='object-contain rounded-md h-64 w-full' />
        </div>
        <div className='p-4 flex justify-between'>
          <Skeleton className='w-1/4 h-10' />
          <Skeleton className='w-1/4 h-10' />
        </div>
      </div>
    </section>
  );
};

export default SkeletonCardsLoader;
