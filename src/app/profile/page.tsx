import React, { FC } from 'react';
import Profile from '@/components/profile';
import NavBar from '@/components/NavBar'
import { redirect } from 'next/navigation';
import supabaseServer from '@/components/supabaseServer';

 const ProfilePage: FC = async() => {
  const{
    data: { session },
  } = await supabaseServer().auth.getSession()

  if(!session) redirect('/')

  return (
    <div className = 'py-12'>
      <NavBar session={session} authToken={false}/>
      <Profile userId={session.user.id}/>
    </div>
  );
};

export default ProfilePage;
