'use client'
import { Check,X } from "lucide-react"
import { Database } from "@/types/supabase"
import {Session, createClientComponentClient} from '@supabase/auth-helpers-nextjs'
import {FC, useEffect, useState} from 'react'
import { chatHrefConstructor } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { v4 as uuidv4 } from 'uuid';

interface Connection {
    created_at: string;
    id: number;
    receiving_user: string | null;
    sending_user: string | null;
}

interface ConnectionPreviewProps{
    session: Session,
    item: Connection
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

const OneRequest: FC<ConnectionPreviewProps> = ({item, session}) => {
    const supabase = createClientComponentClient<Database>()
    const [username, setUsername] = useState<string>("");
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

    //The request should be validated upon creation, check if the friendship exists
    // if item.sending_user = sender or receiver
    // if item.receiving user id = sender or receiver
    const acceptRequest = async() => {
        if(item.sending_user && item.receiving_user){
            const {error: insertError} = await supabase
                .from('friends')
                .insert([{
                    sending_user: item.sending_user,
                    receiving_user: item.receiving_user,
                }])
            const {error: deleteError} = await supabase
                .from('friend_requests')
                .delete()
                .eq('sending_user', item.sending_user)
                .eq('receiving_user', item.receiving_user)

            if(insertError) console.log("INSERT ERROR: " + insertError)
            if(deleteError) console.log("INSERT ERROR: " + deleteError)
        }   

    }

    //cancel request not working, probably the double .eq
    //accept request and then work on displaying sent requests
    const cancelRequest = async() => {
        if(item.sending_user && item.receiving_user){
            const {error} = await supabase
                .from('friend_requests')
                .delete()
                .eq('sending_user', item.sending_user)
                .eq('receiving_user', item.receiving_user)
            if(error)return;
        }
        
    }
    return(
        <div className="flex-1 flex items-center space-x-2">
            <span className="mr-2">{username}</span>
            <span className="text-xs text-midnight">
                {formatDate(item.created_at)}
            </span>
            {
                item.sending_user !== session.user.id ?
                    <span onClick={()=>{acceptRequest()}}>
                        <Check 
                            className="bg-softGreen rounded-full w-6 h-6 flex items-center justify-center hover:shadow-lg hover:ring-2 hover:ring-midnight"
                        />
                    </span>
                    :null
            }
            <span onClick={()=>{cancelRequest()}}>
                <X 
                    className="bg-red rounded-full w-6 h-6 flex items-center justify-center hover:shadow-lg hover:ring-2 hover:ring-midnight"
                />
            </span>
        </div>
    )
}

export default OneRequest