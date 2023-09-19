import React, { FC } from 'react';
import Image from 'next/image';
import PetProfileForm from '@/components/petProfileForm';

const PetProfilePage: FC = () => {
  return (
    <>
      <div className='absolute inset-0 bg-softGreen'>
        <div className='h-full max-w-2x4 mx-auto flex flex-col items-center justify-center gap-20'>
          <PetProfileForm />
        </div>
      </div>
      <div className='fixed top-0 inset-x-0 h-fit bg-softGreen border-b border-zinc-300 z-[10] py-2'>
        <div className='container max-w-7xl h-full mx-auto flex items-center justify-between gap-2'>
          <Image src="/assets/logo.png" priority width={75} height={75} alt="Logo" />
          <p className='hidden text-zinc-700 text-3xl font-large font-bold md:block'>PetConnect</p>
        </div>
      </div>
    </>
  );
};

export default PetProfilePage;
