import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import NavBar from '@/components/NavBar';
import PetCardList from '@/components/PetCardList';
import SimpleNav from '@/components/SimpleNav';

export default async function Home() {
  const supabase = createServerComponentClient({ cookies });
  const cookieStore = cookies().getAll();
  const regex = /.*?(?=auth-token-code-verifier)/;
  const authToken = cookieStore.some(cookie => regex.test(cookie.name));

  const {
    data: { session },
    error
  } = await supabase.auth.getSession();

  return (
<<<<<<< HEAD
    <div className="flex flex-col min-h-screen bg-whiteGreen">
      <NavBar session={session} authToken={authToken} />
      <div className="flex-grow mt-20"> {/* Added mt-4 for margin-top */}
        <PetCardList />
=======
    session ? (
      <div className="flex flex-col min-h-screen bg-whiteGreen">
        <NavBar session={session} />
        <h1 className="font-fredokaOne text-3xl text-center mt-12 mb-8 text-darkBlue z-10">
          Time to connect with others!
        </h1>
        <div className="flex-grow">
          <PetCardList />
        </div>
>>>>>>> 1fc1f4f7894ba8e02f8a385648faa9fd15dd0e7a
      </div>
    )
    :
    <div className='font-bold pt-12'>
      <h1>
      NOT LOGGED IN
      </h1>
      <SimpleNav session={session} authToken={authToken}/>
    </div>
  );
  
}
