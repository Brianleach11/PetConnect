'use client'
import { Database } from '@/types/supabase'
import { createClientComponentClient, Session } from '@supabase/auth-helpers-nextjs'
import { FC, useEffect, useState, useRef } from 'react'
import { ScrollArea } from '../ui/scroll-area'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'

interface ChatWindowProps {
    session: Session,
    initialChats: ChatsArray
}
interface Chats {
    chat_id: string | null
    created_at: string | null
    message_content: string | null
    recipient_id: string | null
    sender_id: string | null
    deleted_by: string | null
}
type ChatsArray = Chats[]

const ChatWindow: FC<ChatWindowProps> = ({ session, initialChats }) => {
    const supabase = createClientComponentClient<Database>()
    const [realtimeChats, setRealtimeChats] = useState(initialChats)
    const scrolldownRef = useRef<HTMLDivElement | null>(null)
    const router = useRouter()
    const [currentChatId, setCurrentChatId] = useState<string | null>(null);

    useEffect(() => {
        const channel = supabase.channel('realtime chats').on('postgres_changes', {
            event: 'INSERT',
            schema: 'public',
            table: 'messages'
        }, (payload) => {
            const newPayload = payload.new as Chats
            if (newPayload.chat_id !== initialChats[0].chat_id) {
                setCurrentChatId(newPayload.chat_id)
                //supabase.removeChannel(channel)
                //router.refresh()
            }
            else {
                setRealtimeChats(oldArray => [newPayload, ...oldArray])
            }
            //setRealtimeChats(oldArray => [payload.new as Chats, ...oldArray])
        }).subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [supabase, realtimeChats, setRealtimeChats, session.user.id, router, currentChatId, setCurrentChatId, initialChats])

    const formatTimestamp = (dateString: string | null) => {
        if (dateString) {
            const date = new Date(dateString);
            return date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
        }
    }

    return (
        <div id='messages' className='flex h-full flex-1 flex-col-reverse pb-2 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch'>
            <div ref={scrolldownRef} />
            {
                realtimeChats && realtimeChats.length > 0 ?
                    realtimeChats.map((item, index) => {
                        const isCurrentUser = item.sender_id === session.user.id;
                        const hasNextMessageFromSameUser = realtimeChats[index - 1]?.sender_id === realtimeChats[index].sender_id;
                        if (item.message_content === "" || item.deleted_by === session.user.id) return null;

                        return (
                            <div className='chat-message my-2' key={item.created_at}>
                                <div className={cn('flex items-end', { 'justify-end': isCurrentUser })}>
                                    <div className={cn('flex flex-col py-0.5 text-base w-2/3 mx-2', {
                                        'order-1 items-end': isCurrentUser,
                                        'order-2 items-start': !isCurrentUser,
                                    })}>
                                        <span
                                            className={cn('px-4 py-1.5 rounded-lg inline-block shadow-md break-words', {
                                                'bg-softGreen text-black': isCurrentUser,
                                                'bg-lightblue text-gray-900': !isCurrentUser,
                                                'rounded-br-none': !hasNextMessageFromSameUser && isCurrentUser,
                                                'rounded-bl-none': !hasNextMessageFromSameUser && !isCurrentUser,
                                            })}
                                        >
                                            {item.message_content}
                                            <span className='ml-2 text-xs text-gray-400'>
                                                {formatTimestamp(item.created_at)}
                                            </span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )
                    }) :
                    <div className='text-center py-48 text-lg'>Loading...</div>
            }
        </div>
    )
}

export default ChatWindow;