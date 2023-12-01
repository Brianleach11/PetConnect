import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import NavBar from '@/components/NavBar';
import PetCardList from '@/components/PetCardList';
import SimpleNav from '@/components/SimpleNav';
import { Card, CardHeader } from '@/components/ui/card';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { Database } from '@/types/supabase';

export default async function Home() {
  const supabase = createServerComponentClient<Database>({ cookies });
  const cookieStore = cookies().getAll();
  const regex = /.*?(?=auth-token-code-verifier)/;
  const authToken = cookieStore.some(cookie => regex.test(cookie.name));

  const {
    data: { session },
    error
  } = await supabase.auth.getSession();

  if (session) {
    const { data } = await supabase
      .from('user')
      .select('*')
      .eq('id', session?.user.id)
      .single()

    if (!data?.username) {
      redirect('/userProfile');
    }
  }


  const updateFilterPreferences = async () => {
    if (session) {
      const { data } = await supabase.from('user').select('*').eq('id', session?.user.id).single()
      if (data?.filter_city === '' || data?.filter_state === '') {
        const { error } = await supabase
          .from('user')
          .update({ looking_for: 'Default', filter_city: 'Any', filter_state: 'Any' })
          .eq('id', session?.user.id);
      }
    }
  };

  updateFilterPreferences()

  return (
    session ? (
      <div className="flex flex-col min-h-screen -mt-12">
        <NavBar session={session} authToken={authToken} />
        <div className="flex-grow mt-24">
          <PetCardList currentUserId={session.user.id} />
        </div>
      </div>
    )
      :
      (
        <div className='overflow-y-auto -mt-12 sm:bg-cover' style={{ backgroundImage: 'url(/assets/hero.png)', backgroundSize: 'cover', overflowY: 'auto' }}>
          <SimpleNav session={session} authToken={authToken} />
          <div className='overflow-y-auto min-h-screen sm:bg-cover' style={{ backgroundImage: 'url(/assets/hero.png)', backgroundSize: 'cover', overflowY: 'auto' }}>
            <div className='mt-8 sm:mt-12'>
              <div className='flex items-center justify-center flex-col sm:flex-row'>
                <Card className='mx-auto drop-shadow-2xl w-11/12 sm:w-4/5 lg:w-3/4 h-48 sm:h-96 text-midnight flex'>
                  <CardHeader className='tracking-wider text-2xl sm:text-3xl lg:text-4xl sm:w-3/4 lg:w-4/5 font-bold flex flex-col justify-center text-center sm:text-left'>
                    <span className='mt-6 sm:mt-0 ml-0 sm:ml-10'>
                      Where Every Tail
                    </span>
                    <span className='mt-6 sm:mt-0 ml-0 sm:ml-10'>
                      Finds a Friend!
                    </span>
                    <span className='ml-0 sm:ml-10 text-sm sm:text-base lg:text-lg sm:pt-6 lg:pt-10 opacity-75'>
                      Join PetConnect to meet new friends, share moments with pets, and be a part of a vibrant pet-loving community.
                    </span>
                  </CardHeader>
                  <div className='hidden sm:flex flex-auto items-center justify-center mr-0 sm:mr-12 drop-shadow-lg'>
                    <Image
                      className='rounded-2xl w-full h-auto max-h-full'
                      src='/assets/herodogs.png'
                      alt='Yayy'
                      width={300}
                      height={300}
                    />
                  </div>
                </Card>
              </div>
              <div className='hidden sm:flex items-center justify-center'>
                <Image
                  src=''
                  alt='Pets meeting'
                  width={1 / 2}
                  height={100}
                />
              </div>
            </div>
            <div className='mt-4 sm:mt-8 lg:mt-16'>
              .
            </div>
            <div className='mt-4 sm:mt-8 lg:mt-16'>
              .
            </div>
            <div className='mt-4 sm:mt-8 lg:mt-16'>
              .
            </div>
            <div className='mt-4 sm:mt-8 lg:mt-16'>
              .
            </div>
            <div className='mt-4 sm:mt-8 lg:mt-24'>
              .
            </div>
          </div>
        </div>

      )
  )
}
