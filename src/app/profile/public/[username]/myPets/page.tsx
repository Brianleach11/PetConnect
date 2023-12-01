import React, { FC } from 'react';
import NavBar from '@/components/NavBar'
import PetProfileDisplay from '@/components/petProfileDisplay';
import { redirect } from 'next/navigation';
import supabaseServer from '@/components/supabaseServer';

const PProfilePage: FC = async () => {
  const {
    data: { session },
  } = await supabaseServer().auth.getSession();

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


