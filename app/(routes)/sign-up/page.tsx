'use client';

import type { NextPage } from 'next';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import Link from 'next/link';

const formSchema = z.object({
  username: z
    .string()
    .min(5, 'Username must be at least 5 characters long.')
    .max(15, 'Username must be at most 15 characters long.'),
  firstName: z
    .string()
    .min(2, 'First name must be at least 2 characters long.'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters long.'),
  email: z.string().email('Invalid email format.'),
  birthday: z.string(),
  password: z.string().min(8, 'Password must be at least 8 characters long.'),
});

const SignUp: NextPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [date, setDate] = useState<Date | undefined>(new Date(2003, 11, 31));

  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      firstName: '',
      lastName: '',
      email: '',
      birthday: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const birthday = date ? format(date, 'yyyy-MM-dd') : '';

    try {
      setIsLoading(true);
      const response = await fetch('/api/auth/sign-up', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...values,
          birthday: birthday,
        }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        if (errorMessage.includes('Username')) {
          form.setError('username', { message: errorMessage });
          return;
        } else if (errorMessage.includes('Email')) {
          form.setError('email', { message: errorMessage });
          return;
        } else {
          throw new Error(errorMessage || 'Something went wrong');
        }
      }

      toast.success('Signed up successfully.');
      router.push('/sign-in');
    } catch (error) {
      setIsLoading(false);
      toast.error('Something went wrong.');
      console.error((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className='my-5'>
      <Card className='lg:max-w-96 max-w-80 m-auto'>
        <CardHeader className='lg:mx-1'>
          <CardTitle>Sign up</CardTitle>
          <CardDescription>Get started</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='flex flex-col justify-center max-w-80 m-auto gap-5'>
              <FormField
                control={form.control}
                name='username'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className='focus-visible:ring-gray-950/50 focus-visible:ring-offset-gray-950/15 focus-visible:ring-1 focus-visible:ring-offset-1 transition-ring-offset duration-300'
                        type='text'
                        placeholder='josh2345'
                        autoComplete='current-username'
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      This is what you will use to login
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='firstName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className='focus-visible:ring-gray-950/50 focus-visible:ring-offset-gray-950/15 focus-visible:ring-1 focus-visible:ring-offset-1 transition-ring-offset duration-300'
                        type='text'
                        placeholder='Josh'
                        autoComplete='current-first-name'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='lastName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className='focus-visible:ring-gray-950/50 focus-visible:ring-offset-gray-950/15 focus-visible:ring-1 focus-visible:ring-offset-1 transition-ring-offset duration-300'
                        type='text'
                        placeholder='Wayne'
                        autoComplete='current-last-name'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className='focus-visible:ring-gray-950/50 focus-visible:ring-offset-gray-950/15 focus-visible:ring-1 focus-visible:ring-offset-1 transition-ring-offset duration-300'
                        placeholder='josh@gmail.com'
                        autoComplete='current-email'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='birthday'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Birthday</FormLabel>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'flex w-full justify-start text-left font-normal',
                              !date && 'text-muted-foreground'
                            )}>
                            {date ? (
                              format(date, 'PPP')
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className='w-auto p-0'>
                          <Calendar
                            disabled={isLoading}
                            initialFocus
                            mode='single'
                            captionLayout='dropdown-buttons'
                            fromYear={1930}
                            toYear={2003}
                            selected={date}
                            onSelect={setDate}
                            className='rounded-md border'
                          />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem className='relative'>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className='focus-visible:ring-gray-950/50 focus-visible:ring-offset-gray-950/15 focus-visible:ring-1 focus-visible:ring-offset-1 transition-ring-offset duration-300'
                        type={showPassword ? 'text' : 'password'}
                        placeholder='password'
                        autoComplete='current-password'
                        {...field}
                      />
                    </FormControl>
                    <Button
                      disabled={isLoading}
                      className='absolute top-7 right-1 flex h-8 w-8'
                      type='button'
                      size='icon'
                      onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? (
                        <EyeOff className='text-center text-xl' />
                      ) : (
                        <Eye className='text-center text-xl' />
                      )}
                    </Button>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button disabled={isLoading} type='submit'>
                Sign up
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className='flex justify-center gap-1 text-sm'>
          <span>Already registered?</span>
          <Link
            href='/sign-in'
            title='Sign in'
            className='text-[#a1a1aa] font-semibold'>
            Sign in
          </Link>
        </CardFooter>
      </Card>
    </section>
  );
};

export default SignUp;
