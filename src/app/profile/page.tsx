import React, { FC } from 'react';
import Profile from '@/components/profile';
import NavBar from '@/components/NavBar'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation';

 const ProfilePage: FC = async() => {
  const supabase = createServerComponentClient({ cookies })
  const{
    data: { session },
  } = await supabase.auth.getSession()

  if(!session) redirect('/')

  return (
    <div className = 'py-12'>
      <NavBar session={session} authToken={false}/>
      <Profile userId={session.user.id}/>
    </div>
  );
};

export default ProfilePage;
