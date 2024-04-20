import { getCurrentUser } from '@/services/auth.service';
import { redirect } from 'next/navigation';

export default function Home() {
  const currentUser = getCurrentUser();

  if (!currentUser) {
    redirect('/sign-in');
  }

  console.log(currentUser);

  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'></main>
  );
}
