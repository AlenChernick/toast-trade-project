'use client';

import type { NextPage } from 'next';
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
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useState } from 'react';

const fromSchema = z.object({
  username: z
    .string()
    .min(5, 'Username must be at least 5 characters long.')
    .max(15, 'Username must be at most 15 characters long.'),
  password: z.string().min(8, 'Password must be at least 8 characters long.'),
});

const SignIn: NextPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const form = useForm<z.infer<typeof fromSchema>>({
    resolver: zodResolver(fromSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof fromSchema>) => {
    try {
      const response = await fetch('/api/auth/sign-in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        if (errorMessage.includes('Username')) {
          form.setError('username', { message: errorMessage });
          return;
        } else if (errorMessage.includes('password')) {
          form.setError('password', { message: errorMessage });
          return;
        } else {
          throw new Error(errorMessage || 'Something went wrong');
        }
      }

      router.push('/');
    } catch (error) {
      console.error((error as Error).message);
    }
  };

  return (
    <section>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='flex flex-col justify-center max-w-80 m-auto gap-5'>
          <FormField
            control={form.control}
            name='username'
            render={({ field }) => (
              <>
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      className='focus-visible:ring-gray-950/50 focus-visible:ring-offset-gray-950/15 focus-visible:ring-1 focus-visible:ring-offset-1 transition-ring-offset duration-300'
                      type='text'
                      placeholder='josh2345'
                      autoComplete='current-username'
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
            name='password'
            render={({ field }) => (
              <FormItem className='relative'>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    className='focus-visible:ring-gray-950/50 focus-visible:ring-offset-gray-950/15 focus-visible:ring-1 focus-visible:ring-offset-1 transition-ring-offset duration-300'
                    type={showPassword ? 'text' : 'password'}
                    placeholder='password'
                    autoComplete='current-password'
                    {...field}
                  />
                </FormControl>
                <Button
                  className='absolute top-7 right-1 flex h-8 w-8'
                  type='button'
                  size='icon'
                  onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <FaEyeSlash className='text-center text-xl' />
                  ) : (
                    <FaEye className='text-center text-xl' />
                  )}
                </Button>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type='submit'>Submit</Button>
        </form>
      </Form>
    </section>
  );
};

export default SignIn;
