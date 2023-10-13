'use client'
import { Send } from "lucide-react"
import { Database } from "@/types/supabase"
import {Session, createClientComponentClient} from '@supabase/auth-helpers-nextjs'
import {FC, useEffect, useState} from 'react'
import { chatHrefConstructor } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { v4 as uuidv4 } from 'uuid';

interface ConnectionPreviewItem {
    id: number;
    created_at: string;
    sending_user: string | null;
    receiving_user: string | null;
}

interface ConnectionPreviewProps{
    session: Session,
    item: ConnectionPreviewItem
}

function formatDate(dateString : string) {
    const today = new Date();
    const date = new Date(dateString);
  
    if (date.toDateString() === today.toDateString()) {
      // Display only time if it's today
      return date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
    } else {
      // Display both date and time if it's not today
      return (
        date.toLocaleDateString(undefined, { month: "short", day: "numeric" })
      );
    }
}

const ConnectionPreview: FC<ConnectionPreviewProps> = ({item, session}) => {
    const supabase = createClientComponentClient<Database>()
    const [username, setUsername] = useState<string>("");
    const [newChatId, setNewChatId] = useState<string>("")
    const router = useRouter()
    const searchUser = (item.sending_user === session.user.id) ? item!.receiving_user : item!.sending_user;
    if(!searchUser)return null;

    useEffect(() => {
        const fetchData = async () => {
            const { data, error } = await supabase
                .from("user")
                .select("username")
                .eq("id", searchUser)
                .single();
            if(error) console.log(error)
            
            if (data && data.username) {
            setUsername(data.username);
            }
        };
        
        fetchData();
    }, [item]);

    const redirectUser = async() =>{
        //console.log("REDIRECT TRIGGERED")
        if(!item.sending_user || !item.receiving_user) return null
        let chatId
        let {data: query, error: chatIdError} = await supabase
            .from('chats')
            .select('chat_id, sender_id, recipient_id')
        if (query && Array.isArray(query)) {
            for(const chatInfo of query){
                if((chatInfo.sender_id == session.user.id && chatInfo.recipient_id == searchUser) ||
                    (chatInfo.sender_id == searchUser && chatInfo.recipient_id == session.user.id)){
                    chatId = chatInfo.chat_id
                }
            }
        }
    
        if(chatIdError) console.log(chatIdError)
        //console.log("RETURNED CHAT ID"+chatId)
    
        if(!chatId){
            const {data: enteredChat, error: newChatError} = await supabase
                .from('messages')
                .insert(
                    {
                        sender_id: session.user.id, 
                        recipient_id: searchUser, 
                        message_content:"", 
                        chat_id: uuidv4()
                    }
                )
                .select()
                .single()
            //console.log(enteredChat)
            if(enteredChat && enteredChat.chat_id){
                console.log("Im setting it!" + enteredChat.chat_id)
                setNewChatId(enteredChat.chat_id)
            }
        }
        else{
            setNewChatId(chatId)
            //console.log("Chat ID already exists: " + chatId)
        }
        //new line to test
        router.refresh()
    }
    useEffect(()=>{
        if(newChatId){
            const href = `/messages/chat/${chatHrefConstructor(
                session.user.id.toString(), 
                searchUser, 
                newChatId
            )}`
            setNewChatId('')
            router.push(href)
        }
    }, [newChatId])
    return(
        <div className="max-h-12 text-midnight border-2 border-midnight rounded-lg hover:border-4">
            <div className="grid grid-cols-2 justify-items-end align-middle py-2 px-4">
                <div>
                    <p className="text-left text-lg">
                        {username}
                    </p>
                </div>
                <Send className="right-0 items-center" onClick={redirectUser}/>
            </div>
        </div>
    )
}

export default ConnectionPreview