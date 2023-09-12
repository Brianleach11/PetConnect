import NavBar from '@/components/NavBar'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
//export const dynamic = 'force-dynamic'

export default async function page(){
    const supabase = createServerComponentClient({cookies})
    const { data: {session}, error } = await supabase.auth.getSession()

    if(error || !session) {
        redirect("/")
    } 

    return (
        <div>
            Welcome to the Chat!
        </div>
            
    )
}
