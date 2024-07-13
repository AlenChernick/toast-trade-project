'use client';
import { type FC, useEffect, useState } from 'react';
import type { AuctionType } from '@/models/auction.model';
import { ApiRoutes, AppRoutes, DashboardActionType } from '@/enum';
import { alcoholTypes } from '@/constants';
import { addDays, format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const CreateOrEditAuction: FC<{
  userId: string;
  sellerName: string;
  auction?: AuctionType | undefined;
}> = ({ userId, sellerName, auction }) => {
  const isEdit = auction !== undefined;

  const formSchema = z.object({
    auctionName: z
      .string()
      .min(5, 'Auction name must be at least 5 characters long.')
      .max(80, 'Auction name must be at most 50 characters long.')
      .nonempty('Auction name cannot be empty'),
    auctionImage: isEdit
      ? z.any()
      : z
          .any()
          .refine((file) => file?.length == 1, 'Image is required.')
          .refine((file) => file[0]?.size <= 3000000, `Max file size is 3MB.`),
    startingBid: isEdit
      ? z.number()
      : z
          .string()
          .transform((val) => {
            const num = parseFloat(val);
            return num;
          })
          .refine((val) => val >= 10, {
            message: 'Starting bid must be at least 10$.',
          }),
    endTime: z
      .string()
      .min(1, 'End time must be specified.')
      .refine(
        (value) => {
          const now = new Date();
          const minimumEndTime = addDays(now, 1);
          const maximumEndTime = addDays(now, 3);
          const endTimeDate = new Date(value);
          return endTimeDate >= minimumEndTime && endTimeDate <= maximumEndTime;
        },
        {
          message:
            'End time must be at least 24 hours from now and no more than 3 days from now.',
        }
      ),
    type: z
      .string()
      .min(1, 'Please select a valid alcohol type.')
      .nonempty('Please select a valid alcohol type.')
      .refine((value) => alcoholTypes.includes(value), {
        message: 'Please select a valid alcohol type.',
      }),
  });
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      auctionName: isEdit ? auction.auctionName : '',
      auctionImage: isEdit ? auction.auctionImage : '',
      startingBid: isEdit ? auction.startingBid : 0,
      endTime: isEdit
        ? format(new Date(auction.endTime), "yyyy-MM-dd'T'HH:mm")
        : format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      type: isEdit ? auction.type : '',
    },
  });
  const imageFileRef = form.register('auctionImage');
  const today = new Date();
  const minDate = format(today, "yyyy-MM-dd'T'HH:mm");
  const maxDate = format(addDays(today, 3), "yyyy-MM-dd'T'HH:mm");
  const auctionEndTime = isEdit && new Date(auction?.endTime);
  const isAuctionActive = today < auctionEndTime;

  useEffect(() => {
    if (!isEdit) {
      form.reset({
        auctionName: '',
        auctionImage: '',
        startingBid: 0,
        endTime: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
        type: '',
      });
    } else {
      if (!isAuctionActive) {
        router.push(
          `${AppRoutes.Dashboard}/${userId}/?type=${DashboardActionType.Auctions}`
        );
      }
    }
  }, [isEdit, form, isAuctionActive, router, userId]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('auctionName', values.auctionName);
      formData.append('auctionImage', values.auctionImage[0]);
      formData.append('startingBid', values.startingBid.toString());
      formData.append('currentBid', values.startingBid.toString());
      formData.append('sellerName', sellerName);
      formData.append('endTime', values.endTime);
      formData.append('type', values.type);
      formData.append('userId', userId);

      if (isEdit) {
        formData.append('auctionId', auction._id);
        if (values.auctionImage !== auction?.auctionImage) {
          formData.append('auctionImageUrl', auction?.auctionImage);
        }
      }

      const response = await fetch(ApiRoutes.DashboardAuction, {
        method: isEdit ? 'PATCH' : 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorMessage = await response.text();

        if (errorMessage.includes('name')) {
          form.setError('auctionName', { message: errorMessage });
          return;
        } else {
          const action = isEdit ? 'update' : 'create';
          toast.error(`Failed to ${action} auction.`);
          throw new Error(`Failed to ${action} auction`);
        }
      }

      toast.success(`Auction ${isEdit ? 'updated' : 'created'} successfully.`);

      router.push(
        `${AppRoutes.Dashboard}/${userId}/?type=${DashboardActionType.Auctions}`
      );
      router.refresh();
    } catch (error) {
      setIsLoading(false);
      toast.error('Something went wrong.');
      console.error((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section>
      <Card className='rounded-lg border bg-card text-card-foreground shadow-sm lg:max-w-96 w-full md:max-w-80 m-auto'>
        <CardHeader>
          <CardTitle>{isEdit ? 'Edit' : 'Create'} Auction</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              noValidate
              onSubmit={form.handleSubmit(onSubmit)}
              className='flex flex-col justify-center m-auto gap-5'>
              <FormField
                control={form.control}
                name='auctionName'
                render={({ field }) => (
                  <>
                    <FormItem>
                      <FormLabel>Auction name</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isLoading}
                          className='input'
                          type='text'
                          placeholder='Speyside Blended Malt 1973'
                          autoComplete='Item Name'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </>
                )}
              />
              <FormField
                control={form.control}
                name='auctionImage'
                render={({ field }) => (
                  <FormItem className='relative'>
                    <FormLabel>Image</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className='cursor-pointer input'
                        type='file'
                        autoComplete='Image'
                        accept='.jpg,.jpeg,.png'
                        {...imageFileRef}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='startingBid'
                render={({ field }) => (
                  <FormItem className='relative'>
                    <FormLabel>Starting bid</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='10'
                        min='10'
                        step='100'
                        disabled={isLoading || isEdit}
                        className='cursor-pointer input'
                        type='number'
                        autoComplete='Starting bid'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='endTime'
                render={({ field }) => (
                  <FormItem className='relative'>
                    <FormLabel>End time</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading || isEdit}
                        className='flex flex-col cursor-pointer input'
                        type='datetime-local'
                        autoComplete='Starting bid'
                        min={minDate}
                        max={maxDate}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='type'
                render={({ field }) => (
                  <FormItem className='relative'>
                    <FormLabel>Alcohol type</FormLabel>
                    <FormControl>
                      <Select
                        disabled={isLoading}
                        onValueChange={field.onChange}
                        defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder='Alcohol type' />
                        </SelectTrigger>
                        <SelectContent>
                          {alcoholTypes.map((type, index) => (
                            <SelectItem key={`${type}-${index}`} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button disabled={isLoading} type='submit'>
                {isEdit ? 'Update' : 'Create'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </section>
  );
};

export default CreateOrEditAuction;
