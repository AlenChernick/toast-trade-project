import { Linkedin } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

const Footer = () => {
  return (
    <footer className='py-3 pl-3 md:pl-0 flex justify-center w-full'>
      <hr className='border-slate-200' />
      <section className='flex justify-center items-center gap-2'>
        <p className='text-xs md:text-base'>
          © 2024 Alen Chernick. All rights reserved.
        </p>
        <nav className='flex items-center'>
          <Link
            href='https://www.linkedin.com/in/alen-chernick'
            title='Linkedin'>
            <Linkedin className='mb-1 w-5 hover:opacity-80 transition-opacity duration-200' />
          </Link>
        </nav>
      </section>
    </footer>
  );
};

export default Footer;
