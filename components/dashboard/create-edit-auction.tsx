'use client';

import { addDays, format } from 'date-fns';
import { useRouter, useSearchParams } from 'next/navigation';
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
import { useLayoutEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { alcoholTypes } from '@/constants';
import { AuctionActionType } from '@/enum';
import type { AuctionType } from '@/models/auction.model';

const CreateOrEditAuction = ({
  userId,
  sellerName,
  auction,
}: {
  userId: string;
  sellerName: string;
  auction?: AuctionType | undefined;
}) => {
  const isEdit = auction !== undefined;
  const formSchema = z.object({
    itemName: z
      .string()
      .min(5, 'Item name must be at least 5 characters long.')
      .max(50, 'Item name must be at most 50 characters long.')
      .nonempty('Item name cannot be empty'),
    itemImage: isEdit
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
            message: 'Starting bid must be at least 10.',
          }),
    endTime: z
      .string()
      .min(1, 'End time must be specified.')
      .refine(
        (value) => {
          const minimumEndTime = addDays(new Date(), 1);
          const endTimeDate = new Date(value);
          return endTimeDate >= minimumEndTime;
        },
        {
          message: 'End time must be at least 24 hours from now.',
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
      itemName: isEdit ? auction.itemName : '',
      itemImage: isEdit ? auction.itemImage : '',
      startingBid: isEdit ? auction.startingBid : 0,
      endTime: isEdit
        ? format(new Date(auction.endTime), "yyyy-MM-dd'T'HH:mm")
        : format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      type: isEdit ? auction.type : '',
    },
  });
  const imageFileRef = form.register('itemImage');
  const today = new Date();
  const minDate = format(today, "yyyy-MM-dd'T'HH:mm");
  const maxDate = format(addDays(today, 3), "yyyy-MM-dd'T'HH:mm");

  useLayoutEffect(() => {
    if (!isEdit) {
      form.reset({
        itemName: '',
        itemImage: '',
        startingBid: 0,
        endTime: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
        type: '',
      });
    }
  }, [isEdit, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('itemName', values.itemName);
      formData.append('itemImage', values.itemImage[0]);
      formData.append('startingBid', values.startingBid.toString());
      formData.append('currentBid', values.startingBid.toString());
      formData.append('sellerName', sellerName);
      formData.append('endTime', values.endTime);
      formData.append('type', values.type);
      formData.append('userId', userId);
      if (isEdit) {
        formData.append('auctionId', auction._id);
      }

      const response = await fetch('/api/dashboard/auction', {
        method: isEdit ? 'PATCH' : 'POST',
        body: formData,
      });

      if (!response.ok) {
        if (isEdit) {
          throw new Error('Failed to update auction');
        } else {
          throw new Error('Failed to create auction');
        }
      }

      toast.success(`Auction ${isEdit ? 'updated' : 'created'} successfully.`);

      router.push(
        `/dashboard/${userId}/?type=${AuctionActionType.AuctionsList}`
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
    <section className='max-w-lg'>
      <Card>
        <CardHeader>
          <CardTitle>{`${isEdit ? 'Edit' : 'Create'}`} Auction</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              noValidate
              onSubmit={form.handleSubmit(onSubmit)}
              className='flex flex-col justify-center m-auto gap-5'>
              <FormField
                control={form.control}
                name='itemName'
                render={({ field }) => (
                  <>
                    <FormItem>
                      <FormLabel>Item name</FormLabel>
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
                name='itemImage'
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
                {`${isEdit ? 'Update' : 'Create'}`}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </section>
  );
};

export default CreateOrEditAuction;
