import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { authService } from '@/services/auth.service';
import { Beer } from 'lucide-react';
import SignOutButton from './sign-out-button';

const Header = async () => {
  const loggedInUser = await authService.getLoggedInUser();

  return (
    <header className='flex items-center justify-between md:px-5 px-2 py-3 shadow-md hover:shadow-lg transition-shadow duration-200 mb-6'>
      <section className='flex items-center gap-2'>
        <Link
          href='/'
          title='Home Page'
          className='flex gap-1 justify-between items-center hover:opacity-90 transition-opacity duration-200'>
          <Beer className='w-4 h-4' />
          <span className='text-sm md:text-lg font-bold'>ToastTrade</span>
        </Link>
        <span className='fixed bottom-1 left-1 z-10 md:static md:z-0'>
          <ThemeToggle />
        </span>
      </section>

      {!loggedInUser ? (
        <nav className='flex items-center gap-2'>
          <Link href='/sign-in' title='Sign in'>
            <Button className='md:h-10 md:px-4 md:py-2' size='sm' type='button'>
              Sign in
            </Button>
          </Link>
          <Link href='/sign-up' title='Sign up'>
            <Button className='md:h-10 md:px-4 md:py-2' size='sm' type='button'>
              Sign up
            </Button>
          </Link>
        </nav>
      ) : (
        <nav className='flex items-center md:gap-5 gap-2'>
          <Link href={`/dashboard/${loggedInUser._id}`} title='Dashboard'>
            <Button className='md:h-10 md:px-4 md:py-2' size='sm' type='button'>
              Dashboard
            </Button>
          </Link>
          <SignOutButton />
        </nav>
      )}
    </header>
  );
};

export default Header;
