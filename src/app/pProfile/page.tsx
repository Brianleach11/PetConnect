import React, { FC } from 'react';
import Image from 'next/image';
import Profile from '@/components/profile';
import NavBar from '@/components/NavBar'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import ProfileDisplay from '@/components/profileDisplay';
import { redirect } from 'next/navigation';

const PProfilePage: FC = async () => {
  const userId = typeof window !== 'undefined' ? localStorage.getItem('clickedUserId') : null;
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if(!session) redirect('/')

  return (
    <div className="flex flex-col min-h-screen bg-whiteGreen">
      <NavBar session={session} authToken={false} />
      <div className="mt-8"> {/* <-- Add this div with a margin class */}
        <ProfileDisplay />
      </div>
    </div>
  );
};

export default PProfilePage;
