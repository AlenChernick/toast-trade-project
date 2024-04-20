import { Linkedin } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

const Footer = () => {
  return (
    <footer className='px-5 py-3 flex justify-center w-full'>
      <hr className='border-slate-200' />

      <section className='flex justify-center items-center md:gap-8 gap-5'>
        <p className='text-sm md:text-base'>
          © 2024 Alen Chernick. All rights reserved.
        </p>
        <nav className='flex items-center'>
          <Link
            href='https://www.linkedin.com/in/alen-chernick'
            title='Linkedin'>
            <Linkedin className='mb-1 hover:opacity-80 transition-opacity duration-200' />
          </Link>
        </nav>
      </section>
    </footer>
  );
};

export default Footer;
