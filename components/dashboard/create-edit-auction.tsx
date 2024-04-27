'use client';

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
import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { alcoholTypes } from '@/constants';

const formSchema = z.object({
  itemName: z
    .string()
    .min(5, 'Item name must be at least 5 characters long.')
    .max(50, 'Item name must be at most 50 characters long.')
    .nonempty('Item name cannot be empty'),
  itemImage: z
    .any()
    .refine((file) => file?.length == 1, 'Image is required.')
    .refine((file) => file[0]?.size <= 3000000, `Max file size is 3MB.`),
  startingBid: z
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

const CreateOrEditAuction = ({
  userId,
  sellerName,
}: {
  userId: string;
  sellerName: string;
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      itemName: '',
      itemImage: '',
      startingBid: 0,
      endTime: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      type: '',
    },
  });

  const imageFileRef = form.register('itemImage');

  const today = new Date();
  const minDate = format(today, "yyyy-MM-dd'T'HH:mm");
  const maxDate = format(addDays(today, 3), "yyyy-MM-dd'T'HH:mm");

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

      const response = await fetch('/api/dashboard/auction', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to create auction');
      }

      toast.success('Auction created successfully.');
      form.reset();
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
    <section className='m-auto max-w-lg'>
      <Card>
        <CardHeader>
          <CardTitle>Create Auction</CardTitle>
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
                          className='focus-visible:ring-gray-950/50 focus-visible:ring-offset-gray-950/15 focus-visible:ring-1 focus-visible:ring-offset-1 transition-ring-offset duration-300'
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
                        className='cursor-pointer focus-visible:ring-gray-950/50 focus-visible:ring-offset-gray-950/15 focus-visible:ring-1 focus-visible:ring-offset-1 transition-ring-offset duration-300'
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
                        disabled={isLoading}
                        className='cursor-pointer focus-visible:ring-gray-950/50 focus-visible:ring-offset-gray-950/15 focus-visible:ring-1 focus-visible:ring-offset-1 transition-ring-offset duration-300'
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
                        disabled={isLoading}
                        className='cursor-pointer focus-visible:ring-gray-950/50 focus-visible:ring-offset-gray-950/15 focus-visible:ring-1 focus-visible:ring-offset-1 transition-ring-offset duration-300'
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
                Create
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </section>
  );
};

export default CreateOrEditAuction;
