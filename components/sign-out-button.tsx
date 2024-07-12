'use client';
import { useState } from 'react';
import { ApiRoutes } from '@/enum';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

const SignOutButton = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      await fetch(ApiRoutes.AuthSignIn, {
        method: 'DELETE',
      });
      router.refresh();
    } catch (error) {
      setIsLoading(false);
      console.error((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      className='md:h-10 md:px-4 md:py-2'
      size='sm'
      disabled={isLoading}
      onClick={handleSignOut}
      type='button'>
      Sign out
    </Button>
  );
};

export default SignOutButton;
