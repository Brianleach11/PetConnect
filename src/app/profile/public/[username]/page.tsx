import React, { FC } from 'react';
import Image from 'next/image';
import Profile from '@/components/profile';
import NavBar from '@/components/NavBar'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import UserProfileDisplay from '@/components/userProfileDisplay';

const ProfilePage: FC = async () => {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <div className="flex flex-col min-h-screen bg-whiteGreen">
      <NavBar session={session} authToken={false} />
      <div className="mt-8"> {/* <-- Add this div with a margin class */}
        <UserProfileDisplay />
      </div>
    </div>
  );
};

export default ProfilePage;
