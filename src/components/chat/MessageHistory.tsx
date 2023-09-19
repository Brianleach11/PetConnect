'use client'
import { Session } from "@supabase/auth-helpers-nextjs"
import { FC } from "react"
import MessagePreview from "./MessagePreview"
import { useState, useEffect } from "react"
import { chatHrefConstructor } from "@/lib/utils"
import { useRouter } from "next/navigation"

interface RecentMessages{
    chat_id: number | null;
    created_at: string | null;
    message_content: string | null;
    recipient_id: string | null;
    recipient_username: string | null;
    sender_id: string | null;
    sender_username: string | null;
}
type nullableRecentMessages = RecentMessages[] | null

interface MessageHistoryProps{
    session: Session,
    recentMessages: nullableRecentMessages,
    recentMessagesCount: number,
}

const MessageHistory: FC<MessageHistoryProps> = ({session, recentMessages, recentMessagesCount}) => {
    const [toRedirect, setToRedirect ] = useState<number>()
    const router = useRouter()

    useEffect(()=>{
        if(recentMessages && toRedirect !== null && toRedirect !== undefined)
        {
            if(recentMessages[toRedirect].sender_id && recentMessages[toRedirect].recipient_id && recentMessages[toRedirect].chat_id){
                const href = `/messages/chat/${chatHrefConstructor(
                    recentMessages[toRedirect].sender_id, 
                    recentMessages[toRedirect].recipient_id, 
                    recentMessages[toRedirect].chat_id
                )}`
                router.push(href)
            } 
        }
        

    }, [toRedirect])

    return(
        <div>
            {
            recentMessagesCount === 0 ? 
                <div className="text-midnight">No recent messages...</div> :
                recentMessages?.map((item, index) => (
                    <div className="hover:drop-shadow-md rounded-lg py-1" key={index} onClick={()=>setToRedirect(index)}>
                        <MessagePreview key={index} item={item} session={session}/>
                    </div>
                ))
            }
        </div>
    )
}

export default MessageHistory
