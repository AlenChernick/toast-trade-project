import { Skeleton } from '@/components/ui/skeleton';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';

const SkeletonCarouselLoader = () => {
  return (
    <section className='flex flex-col items-center md:justify-between md:px-24 px-0'>
      <h1 className='md:text-3xl text-lg font-semibold text-center border-b-4 pb-2 border-primary mb-5'>
        Welcome to ToastTrade: Where Every Sip Tells a Story!
      </h1>
      <section className='w-full'>
        <h2 className='md:text-2xl text-lg ml-4 mb-3'>Latest auctions</h2>
        <section>
          <div
            className='relative'
            role='region'
            aria-roledescription='carousel'>
            <div className='overflow-hidden'>
              <div
                className='flex -ml-0'
                style={{ transform: 'translate3d(0px, 0px, 0px)' }}>
                <div
                  role='group'
                  aria-roledescription='slide'
                  className='min-w-0 shrink-0 grow-0 basis-full'>
                  <Carousel>
                    <CarouselContent className='-ml-0'>
                      {[1, 2].map((_, index) => (
                        <CarouselItem key={index} className='pl-0'>
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
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className='hidden md:flex' />
                    <CarouselNext className='hidden md:flex' />
                  </Carousel>
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>
    </section>
  );
};

export default SkeletonCarouselLoader;
