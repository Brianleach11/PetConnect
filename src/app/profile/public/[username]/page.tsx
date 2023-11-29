import React, { FC } from 'react';
import NavBar from '@/components/NavBar'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import UserProfileDisplay from '@/components/userProfileDisplay';
import { redirect } from 'next/navigation';

const ProfilePage: FC = async () => {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if(!session) redirect('/')

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <NavBar session={session} authToken={false} />
      <div className="mt-8"> 
        <UserProfileDisplay />
      </div>
    </div>
  );
};

export default ProfilePage;
