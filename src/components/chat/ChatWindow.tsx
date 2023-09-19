'use client'
import { Database } from '@/types/supabase'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import {FC, useEffect, useState} from 'react'

interface ChatWindowProps{
    chat: number
}
interface Chats{
    chat_id: number | null
    created_at: string | null
    message_content: string | null
    recipient_id: string | null
    sender_id: string | null
}
type ChatsArray = Chats[]

const ChatWindow: FC<ChatWindowProps> = ({chat}) => {
    const supabase = createClientComponentClient<Database>()
    const [chats, setChats] = useState<ChatsArray>()
    const getChats = async()=>{
        const {data} = await supabase.from('chats').select("*").eq('chat_id', chat)
        if(data && data !== undefined){
            setChats(data as ChatsArray)
        }
        
    }
    useEffect(()=>{
        getChats()
    }, [])
    return (
    <div>
        {chats !== undefined && chats.length > 0 ? chats.map((item, index) => (
            <div className="px-2 py-2 text-center text-lg" key={index}>
                {item.message_content}
            </div>
        )) : <div className='text-center py-48 text-lg'>Loading...</div>}
    </div>
  )
}

export default ChatWindow
