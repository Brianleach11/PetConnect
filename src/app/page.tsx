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
    session ? (
      <div className="flex flex-col min-h-screen bg-whiteGreen">
        <NavBar session={session} authToken={authToken} />
        <div className="flex-grow mt-20"> {/* Added mt-4 for margin-top */}
          <PetCardList />
        </div>
      </div>
    )
    :
    (
      <div className='font-bold pt-12'>
        <h1>
        NOT LOGGED IN
        </h1>
        <SimpleNav session={session} authToken={authToken}/>
      </div>
    )
  ) 
}
