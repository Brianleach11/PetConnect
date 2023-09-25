import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import NavBar from '@/components/NavBar';
import PetCardList from '@/components/PetCardList';

export default async function Home() {
  const supabase = createServerComponentClient({ cookies });
  const cookieStore = cookies().getAll();
  const regex = /.*?(?=auth-token-code-verifier)/;
  const authToken = cookieStore.some(cookie => regex.test(cookie.name));

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <div className="flex flex-col min-h-screen bg-darkGreen">
      <NavBar session={session} authToken={authToken} />
      <h1 className="font-fredokaOne text-3xl text-center mt-12 mb-8 text-darkBlue z-10">
        Time to connect with others!
      </h1>
      <div className="flex-grow">
        <PetCardList />
      </div>
    </div>
  )
}
