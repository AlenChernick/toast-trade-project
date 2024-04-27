'use client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const SignOutButton = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      await fetch('/api/auth/sign-in', {
        method: 'DELETE',
      });
      router.push('/sign-in');
      router.refresh();
    } catch (error) {
      setIsLoading(false);
      console.error((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button disabled={isLoading} onClick={handleSignOut} type='button'>
      Sign out
    </Button>
  );
};

export default SignOutButton;
