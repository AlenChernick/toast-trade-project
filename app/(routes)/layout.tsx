import Footer from '@/components/footer';
import Header from '@/components/header';

const MainLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      <main className='main-container'>{children}</main>
      <Footer />
    </>
  );
};

export default MainLayout;
