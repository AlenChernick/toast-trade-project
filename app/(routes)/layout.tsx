import Header from '@/components/header';

const MainLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      <main className='main-container'>{children}</main>
    </>
  );
};

export default MainLayout;
