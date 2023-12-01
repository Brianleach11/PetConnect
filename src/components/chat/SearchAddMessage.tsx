import { createClientComponentClient, Session } from "@supabase/auth-helpers-nextjs"
import { FC, useEffect, useState } from "react"
import { Button, buttonVariants } from "../ui/button"
import { Database } from "@/types/supabase"
import { useToast } from "../ui/use-toast"
import { useRouter } from "next/navigation"
import { v4 as uuidv4 } from 'uuid';
import { chatHrefConstructor } from "@/lib/utils"

interface SearchAddMessageProps {
    session: Session
}

const SearchAddMessage: FC<SearchAddMessageProps> = ({session}) => {
    const [username, setUsername] = useState<string>("");
    const [otherUser, setUser] = useState<string>("")
    const supabase = createClientComponentClient<Database>();
    const [route, setRoute] = useState<string>("")
    const {toast} = useToast()
    const router = useRouter()

    const handleSearch = async() => {
        if(username){
            const{data: user, error: noUser} = await supabase
                .from('user')
                .select('id')
                .ilike('username', `%${username}%`)
                .single()

            if(!user || noUser){
                toast({
                    title: "Error",
                    description: "User not found, try again",
                    variant: 'destructive',
                })
                return
            }
            setUser(user.id)
            console.log(user)

            const{data: exists1, error: alreadyExists1} = await supabase
                .from('messages')
                .select('chat_id, deleted_by')
                .eq(`sender_id`, session.user.id)
                .eq(`recipient_id`, user.id)
                .limit(1)
                .single()
            const{data: exists2, error: alreadyExists2} = await supabase
                .from('messages')
                .select('chat_id, deleted_by')
                .eq(`sender_id`, user.id)
                .eq(`recipient_id`, session.user.id)
                .limit(1)
                .single()

//if the user deleted a chat with another user, then it finds it and can't send them to it. 

            if(exists1 && exists1.chat_id && exists1.deleted_by !== session.user.id){
                setRoute(exists1.chat_id)
            } 
            else if(exists2 && exists2.chat_id && exists2.deleted_by !== session.user.id){
                setRoute(exists2.chat_id)
            }
            else if((exists2 && exists2.chat_id && exists2.deleted_by === session.user.id) || (exists1 && exists1.chat_id && exists1.deleted_by === session.user.id)){
                toast({
                    title: "Success",
                    description: `Taking you to a message with ${username}.`,
                    variant: 'default',
                })
                const chatId = (exists2 ? exists2.chat_id : exists1?.chat_id) as string;
                const {data: newMessage, error} = await supabase  
                    .from('messages')
                    .insert(
                        {
                            sender_id: session.user.id, 
                            recipient_id: user.id, 
                            message_content:"", 
                            chat_id: chatId
                        }
                    )
                    .select()
                    .single()

                setRoute(chatId)
                setUsername('')
                return
            }
            if(exists1 || exists2){
                toast({
                    title: "Error",
                    description: `A message with ${username} already exists.`,
                    variant: 'destructive',
                })
                setUsername('')
                return
            }

            const {data: newMessage, error} = await supabase  
                .from('messages')
                .insert(
                    {
                        sender_id: session.user.id, 
                        recipient_id: user.id, 
                        message_content:"", 
                        chat_id: uuidv4()
                    }
                )
                .select()
                .single()

            if(error || !newMessage || !newMessage.chat_id){
                toast({
                    title: "Error",
                    description: `Failed to add user: ${username}`,
                    variant: 'destructive',
                })
                return
            }
            else{
                toast({
                    title: "Success",
                    description: `Message created!`,
                    variant: 'default',
                })
                setRoute(newMessage.chat_id)
                setUsername('')
            }
        }
    }

    useEffect(()=>{
        if(route){
            const href = `/messages/chat/${chatHrefConstructor(
                session.user.id.toString(), 
                otherUser, 
                route
            )}`
            setRoute('')
            router.refresh()
            router.push(href)
        }
    }, [route, setRoute, otherUser, router, session.user.id])

    return (
        <div className='flex flex-row w-full'>
            <div className="flex-grow">
                <input
                    type="text"
                    placeholder="Search by username..."
                    className="border-2 border-midnight border-opacity-100 w-3/4 rounded-sm h-full text-midnight"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            <Button 
                className={`${buttonVariants({ variant: 'default' })}`} 
                onClick={() => handleSearch()}>
                Add
            </Button>
        </div>
    );
}

export default SearchAddMessage;