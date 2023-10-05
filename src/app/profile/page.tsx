import React, { FC } from 'react';
import Image from 'next/image';
import Profile from '@/components/profile';
import NavBar from '@/components/NavBar'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

 const ProfilePage: FC = async() => {
  const supabase = createServerComponentClient({ cookies })
  const{
    data: { session },
  } = await supabase.auth.getSession()


  return (
    <div className = 'py-12'>
      <NavBar session={session} authToken={false}/>
      <Profile />
    </div>
  );
};

export default ProfilePage;
