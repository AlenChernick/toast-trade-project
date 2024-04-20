'use client';
import { useRouter } from 'next/navigation';
import { Button } from './button';

const SignOutButton = () => {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/sign-in', {
        method: 'DELETE',
      });
      router.push('/sign-in');
      router.refresh();
    } catch (error) {
      console.error((error as Error).message);
    }
  };

  return (
    <Button onClick={handleSignOut} type='button'>
      Sign out
    </Button>
  );
};

export default SignOutButton;
