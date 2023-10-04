import { Database } from '@/types/supabase'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
export const dynamic = 'force-dynamic'
import { chatHrefConstructor } from "@/lib/utils"

const page = async () => {
    const supabase = createServerComponentClient<Database>({cookies})
    const {data: {session}, error: sessionError} = await supabase.auth.getSession()

    if(!session || sessionError) redirect('/')

    const {data: recentMessage} = await supabase
        .from("recent_messages")
        .select("*")
        .is('deleted_by', null)
        .or(`recipient_id.eq.${session.user.id}, sender_id.eq.${session.user.id}`)
        .order('created_at', {ascending:false})
        .limit(1)
        .single()

    if(recentMessage){
        const href=`/messages/chat/${chatHrefConstructor(
            recentMessage.sender_id, 
            recentMessage.recipient_id, 
            recentMessage.chat_id)}`;
        redirect(href)
    }
    return (
        <div/>
    )
}

export default page
