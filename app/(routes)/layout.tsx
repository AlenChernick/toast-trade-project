import Footer from '@/components/footer';
import Header from '@/components/header';

const MainLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <section className='flex flex-col min-h-screen'>
      <Header />
      <main className='main-container'>{children}</main>
      <Footer />
    </section>
  );
};

export default MainLayout;
