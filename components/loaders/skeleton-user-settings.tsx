import { Skeleton } from '@/components/ui/skeleton';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const SkeletonUserSettings = () => {
  return (
    <section>
      <Card className='lg:max-w-96 w-full md:max-w-80 m-auto'>
        <CardHeader className='lg:mx-1'>
          <CardTitle>
            <Skeleton className='h-6 w-32' />
          </CardTitle>
          <CardDescription>
            <Skeleton className='h-4 w-64 mt-2' />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col justify-center md:w-80 max-w-96 m-auto gap-5'>
            <div>
              <Skeleton className='h-5 w-20 mb-2' />
              <Skeleton className='h-10' />
            </div>
            <div>
              <Skeleton className='h-5 w-20 mb-2' />
              <Skeleton className='h-10 w-full' />
            </div>
            <div>
              <Skeleton className='h-5 w-20 mb-2' />
              <Skeleton className='h-10 w-full' />
            </div>
            <div className='relative'>
              <Skeleton className='h-5 w-20 mb-2' />
              <Skeleton className='h-10 w-full' />
              <Skeleton className='absolute top-7 right-1 h-8 w-8' />
            </div>
            <div className='relative'>
              <Skeleton className='h-5 w-32 mb-2' />
              <Skeleton className='h-10 w-full' />
              <Skeleton className='absolute top-7 right-1 h-8 w-8' />
            </div>
            <Skeleton className='h-10 w-full mt-4' />
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default SkeletonUserSettings;
