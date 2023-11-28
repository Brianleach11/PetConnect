import React, { FC } from 'react';
import NavBar from '@/components/NavBar'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import PetProfileDisplay from '@/components/petProfileDisplay';
import { redirect } from 'next/navigation';

const PProfilePage: FC = async () => {
    const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if(!session) redirect('/')

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <NavBar session={session} authToken={false} />
      <div className="mt-8"> 
        {<PetProfileDisplay />}
      </div>
    </div>
  );
};

export default PProfilePage;


