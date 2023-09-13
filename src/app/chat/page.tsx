import MessageHistory from '@/components/chat/MessageHistory'
import NavBar from '@/components/NavBar'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
export const dynamic = 'force-dynamic'

export default async function page(){
    const supabase = createServerComponentClient({cookies})
    const { data: {session}, error } = await supabase.auth.getSession()

    if(error || !session) {
        redirect("/")
    } 

    return (
        <div className='bg-softGreen'>
            <NavBar session={session} authToken={false}/>
            <div className='px-4 py-2 rounded-3xl fixed left-0 w-1/3 min-h-screen bg-softGreen'>
                <MessageHistory/>
            </div>
        </div>
    )
}
