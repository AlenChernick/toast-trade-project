'use client';

import { type FC, useState } from 'react';
import type { JwtUser } from '@/models/user.model';
import { ApiRoutes, AppRoutes } from '@/enum';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import DeleteUserAlert from '@/components/alerts/delete-user-alert';

const formSchema = z
  .object({
    firstName: z
      .string()
      .min(2, 'First name must be at least 2 characters long.'),
    lastName: z
      .string()
      .min(2, 'Last name must be at least 2 characters long.'),
    email: z.string().email('Invalid email format.'),
    password: z.string().min(8, 'Password must be at least 8 characters long.'),
    confirmPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters long.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

const UserSettings: FC<{
  loggedInUser: JwtUser;
  isUserHaveActiveAuctionsOrBids: boolean | undefined;
}> = ({ loggedInUser, isUserHaveActiveAuctionsOrBids }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean[]>([false, false]);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: loggedInUser.firstName,
      lastName: loggedInUser.lastName,
      email: loggedInUser.email,
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      const response = await fetch(ApiRoutes.DashboardUser, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...values, userId: loggedInUser._id }),
      });

      if (!response.ok) {
        toast.error(`Failed to update user.`);
        throw new Error(`Failed to update user`);
      }

      toast.success('Updated user successfully.');
      router.push(`${AppRoutes.Dashboard}/${loggedInUser._id}`);
      router.refresh();
    } catch (error) {
      setIsLoading(false);
      toast.error('Something went wrong.');
      console.error((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = (index: number) => {
    const updatedShowPassword = [...showPassword];
    updatedShowPassword[index] = !updatedShowPassword[index];
    setShowPassword(updatedShowPassword);
  };

  return (
    <section>
      <Card className='lg:max-w-96 w-full md:max-w-80 m-auto'>
        <CardHeader className='lg:mx-1'>
          <CardTitle>{loggedInUser.username} User settings</CardTitle>
          <CardDescription>
            You can change your username, email, password and delete your
            account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='flex flex-col justify-center md:max-w-80 m-auto gap-5'>
              <FormField
                control={form.control}
                name='firstName'
                render={({ field }) => (
                  <>
                    <FormItem>
                      <FormLabel>First name</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isLoading}
                          className='input'
                          type='text'
                          autoComplete='current-first-name'
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
                name='lastName'
                render={({ field }) => (
                  <FormItem className='relative'>
                    <FormLabel>Last name</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className='input'
                        type='input'
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
                        disabled={true}
                        className='input'
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
                name='password'
                render={({ field }) => (
                  <FormItem className='relative'>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className='input'
                        type={showPassword[0] ? 'text' : 'password'}
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
                      onClick={() => togglePasswordVisibility(0)}>
                      {showPassword[0] ? (
                        <EyeOff className='text-center text-xl' />
                      ) : (
                        <Eye className='text-center text-xl' />
                      )}
                    </Button>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='confirmPassword'
                render={({ field }) => (
                  <FormItem className='relative'>
                    <FormLabel>Confirm password</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className='input'
                        type={showPassword[1] ? 'text' : 'password'}
                        placeholder='confirm password'
                        autoComplete='current-password'
                        {...field}
                      />
                    </FormControl>
                    <Button
                      disabled={isLoading}
                      className='absolute top-7 right-1 flex h-8 w-8'
                      type='button'
                      size='icon'
                      onClick={() => togglePasswordVisibility(1)}>
                      {showPassword[1] ? (
                        <EyeOff className='text-center text-xl' />
                      ) : (
                        <Eye className='text-center text-xl' />
                      )}
                    </Button>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <CardFooter className='flex w-full justify-between p-0'>
                <Button variant='secondary' disabled={isLoading} type='submit'>
                  Update user
                </Button>
                <DeleteUserAlert
                  userId={loggedInUser._id}
                  isUserHaveActiveAuctionsOrBids={
                    isUserHaveActiveAuctionsOrBids
                  }
                />
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </section>
  );
};

export default UserSettings;
