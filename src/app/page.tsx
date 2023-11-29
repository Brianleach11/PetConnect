import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import NavBar from '@/components/NavBar';
import PetCardList from '@/components/PetCardList';
import SimpleNav from '@/components/SimpleNav';
import { Card, CardHeader } from '@/components/ui/card';
import Image from 'next/image';

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
      <div className="flex flex-col min-h-screen -mt-12">
        <NavBar session={session} authToken={authToken} />
        <div className="flex-grow mt-24">
          <PetCardList currentUserId={session.user.id} />
        </div>
      </div>
    )
      :
      (
        <div className=' overflow-y-auto -mt-12' style={{ backgroundImage: 'url(/assets/hero.png)', backgroundSize: 'cover', overflowY: 'auto' }}>
          <SimpleNav session={session} authToken={authToken} />
          <div className=' overflow-y-auto min-h-screen' style={{ backgroundImage: 'url(/assets/hero.png)', backgroundSize: 'cover', overflowY: 'auto' }}>
            <div className=' mt-48'>
              <div className='flex items-center justify-center'>
                <Card className='mx-auto drop-shadow-2xl w-3/4 h-96 text-midnight flex'>
                  <CardHeader className=' tracking-wider text-4xl w-3/4 font-bold flex flex-col justify-center'>
                    <span className='mt-6 ml-10'>
                      Where Every Tail
                    </span>
                    <span className='mt-6 ml-10'>
                      Finds a Friend!
                    </span>
                    <span className='ml-10 text-lg pt-10 opacity-75'>
                      Join PetConnect to meet new friends, share moments with pets, and be a part of a vibrant pet-loving community.
                    </span>
                  </CardHeader>
                  <div className='flex flex-auto items-center justify-center mr-12 drop-shadow-lg'>
                    <Image
                      className='rounded-2xl w-auto h-auto max-w-full max-h-full'
                      src='/assets/herodogs.png'
                      alt='Yayy'
                      width={300}
                      height={300}
                    />
                  </div>
                </Card>
              </div>
              <div className='flex items-center justify-center'>
                <Image
                  src=''
                  alt='Pets meeting'
                  width={1 / 2}
                  height={100}
                />
              </div>
            </div>
            <div className='mt-64'>
              .
            </div>
            <div className='mt-64'>
              .
            </div>
            <div className='mt-64'>
              .
            </div>
            <div className='mt-64'>
              .
            </div>
            <div className='mt-96'>
              .
            </div>
          </div>
        </div>
      )
  )
}
