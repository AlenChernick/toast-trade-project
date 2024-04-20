import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { getLoggedInUser } from '@/services/auth.service';
import SignOutButton from './ui/sign-out-button';

const Header = async () => {
  const loggedInUser = await getLoggedInUser();

  return (
    <header className='flex items-center justify-between px-5 py-3'>
      <section className='flex items-center gap-3'>
        <Link href='/' title='Home Page'>
          <span className='text-lg font-bold hover:opacity-90 transition-opacity duration-200'>
            ToastTrade
          </span>
        </Link>
        <ThemeToggle />
      </section>

      {!loggedInUser ? (
        <nav className='flex items-center gap-2'>
          <Link href='/sign-in' title='Sign in'>
            <Button type='button'>Sign in</Button>
          </Link>
          <Link href='/sign-up' title='Sign up'>
            <Button type='button'>Sign up</Button>
          </Link>
        </nav>
      ) : (
        <section className='flex items-center md:gap-5 gap-3'>
          <span className='md:text-base text-sm'>
            Hello {`${loggedInUser.firstName}`}
          </span>
          <SignOutButton />
        </section>
      )}
    </header>
  );
};

export default Header;
