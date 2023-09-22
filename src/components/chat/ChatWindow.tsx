'use client'
import { Database } from '@/types/supabase'
import { createClientComponentClient, Session } from '@supabase/auth-helpers-nextjs'
import {FC, useEffect, useState, useRef} from 'react'
import { ScrollArea } from '../ui/scroll-area'
import { cn } from '@/lib/utils'

interface ChatWindowProps{
    chat: number,
    session: Session,
    initialChats: ChatsArray
}
interface Chats{
    chat_id: number | null
    created_at: string | null
    message_content: string | null
    recipient_id: string | null
    sender_id: string | null
}
type ChatsArray = Chats[]

const ChatWindow: FC<ChatWindowProps> = ({chat, session, initialChats}) => {
    const supabase = createClientComponentClient<Database>()
    const [realtimeChats, setRealtimeChats] = useState(initialChats)
    const scrolldownRef = useRef<HTMLDivElement | null>(null)

    useEffect(()=>{
        const channel = supabase.channel('realtime chats').on('postgres_changes', {
            event: 'INSERT', 
            schema: 'public', 
            table: 'messages'
        }, (payload) => {
            setRealtimeChats([...initialChats, payload.new as Chats])
        }).subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [supabase, realtimeChats, setRealtimeChats, session.user.id])

    const formatTimestamp = (dateString: string | null) => {
        if(dateString){
            const date = new Date(dateString);
            return date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
        }
    }

    useEffect(() => {
        // Scroll to the bottom of the chat container when messages are loaded or updated.
        if (scrolldownRef.current) {
            scrolldownRef.current.scrollTop = scrolldownRef.current.scrollHeight;
            console.log(scrolldownRef.current.scrollTop)
            console.log(scrolldownRef.current.offsetHeight)
        }
    }, [realtimeChats]);

    return (
    <ScrollArea className='h-full flex flex-col-reverse' ref={scrolldownRef}>
        {
        //container for the chat messages, needs to scroll
        }
        {realtimeChats !== undefined && realtimeChats.length > 0 ? 
        realtimeChats.map((item, index) => {
            const isCurrentUser = item.sender_id === session.user.id
            const hasNextMessageFromSameUser = realtimeChats[index - 1]?.sender_id === realtimeChats[index].sender_id
            return(
                <div
                    className='chat-message'
                    key={item.created_at}>
                    <div
                        className={cn('flex items-end', {
                            'justify-end': isCurrentUser,
                        })}>
                        <div className={cn(
                            'flex flex-col space-y-2 text-base max-w-xs mx-2',
                            {
                                'order-1 items-end': isCurrentUser,
                                'order-2 items-start': !isCurrentUser,
                            }
                            )}>
                            <span
                                className={cn('px-4 py-2 rounded-lg inline-block', {
                                    'bg-indigo-600 text-black': isCurrentUser,
                                    'bg-gray-200 text-gray-900': !isCurrentUser,
                                    'rounded-br-none':
                                    !hasNextMessageFromSameUser && isCurrentUser,
                                    'rounded-bl-none':
                                    !hasNextMessageFromSameUser && !isCurrentUser,
                                })}>
                                {item.message_content}{' '}
                                <span className='ml-2 text-xs text-gray-400'>
                                    {formatTimestamp(item.created_at)}
                                </span>
                            </span>
                        </div>
                    </div>
                </div>
            )
        }) : 
        <div className='text-center py-48 text-lg'>Loading...</div>}
    </ScrollArea>
  )
}

export default ChatWindow
