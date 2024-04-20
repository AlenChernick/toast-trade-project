import { getCurrentUser } from '@/services/auth.service';
import { redirect } from 'next/navigation';

export const Home = () => {
  const currentUser = getCurrentUser();

  if (!currentUser) {
    redirect('/sign-in');
  }

  return (
    <section className='flex min-h-screen flex-col items-center justify-between p-24'>
      HomePage
    </section>
  );
};

export default Home;
