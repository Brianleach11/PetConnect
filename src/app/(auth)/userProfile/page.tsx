import React, { FC } from 'react'; 
import UserProfileForm from '@/components/userProfileForm';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import supabaseServer from '@/components/supabaseServer';

const UserProfilePage = async() => {
  const { data: { session }, error: sessionError } = await supabaseServer().auth.getSession();

  if(!session) redirect('/')
  return (
    <>
      {/* Header */}
      <div className='fixed top-0 inset-x-0 h-fit bg-softGreen border-b border-zinc-300 z-[10] py-2'>
        <div className='container max-w-7xl h-full mx-auto flex items-center'>
          <div className="flex items-center gap-2">  {/* Container for Logo and Site Name */}
            <Image src="/assets/logo.png" priority width={75} height={75} alt="Logo" />
            <p className='hidden text-zinc-700 text-3xl font-large font-bold md:block'>PetConnect</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='h-full max-w-3xl mx-auto flex flex-col items-center justify-center gap-20 mt-10'>
        <UserProfileForm />
      </div>
    </>
  );
};

export default UserProfilePage;
