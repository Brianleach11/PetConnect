'use client'
import { Session, createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { FC } from "react"
import MessagePreview from "./MessagePreview"
import { useState, useEffect } from "react"
import { chatHrefConstructor } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { X, PenSquare, Trash2, MailMinus } from "lucide-react"
import * as Dialog from '@radix-ui/react-dialog';
import { Button } from "../ui/button"
import { Database } from "@/types/supabase"
import SearchAddMessage from "./SearchAddMessage"
import { ScrollArea } from "@radix-ui/react-scroll-area"

interface Message {
    chat_id: string | null;
    created_at: string;
    deleted_by: string | null;
    id: number;
    message_content: string | null;
    recipient_id: string | null;
    sender_id: string | null;
}

interface RecentMessages{
    chat_id: string | null;
    created_at: string | null;
    message_content: string | null;
    recipient_id: string | null;
    recipient_username: string | null;
    sender_id: string | null;
    sender_username: string | null;
    deleted_by: string | null;
    //seen: boolean | null;
}
type RecentMessagesArray = RecentMessages[]

interface MessageHistoryProps{
    session: Session,
    recentMessages: RecentMessagesArray,
    recentMessagesCount: number,
}

const MessageHistory: FC<MessageHistoryProps> = ({session, recentMessages, recentMessagesCount}) => {
    const [toRedirect, setToRedirect ] = useState<number>()
    const [deleteMessages, setDeleteMessages] = useState<boolean>(false)
    const [showSearchBar, setSearchBar] = useState<boolean>(false)
    const router = useRouter()
    const supabase = createClientComponentClient<Database>()
    const [realtimePreviews, setRealtimePreviews] = useState(recentMessages)
    const [currentPathname, setCurrentPathname] = useState<string>('')
    const [activePreview, setActivePreview] = useState<number>(0)

    const getRecentMessage = async(newPayload: Message) => {
        const chatId = newPayload.chat_id;
        if(chatId){
            const {data: recentMessage} = await supabase  
                .from('recent_messages')
                .select('*')
                .eq('chat_id', chatId)
                .order('created_at', {ascending: false})
                .limit(1)
                .single()

            if(recentMessage)
                return recentMessage as RecentMessages
            else return
        }   
    }

    useEffect(()=>{
        const channel = supabase.channel('realtime previews').on('postgres_changes', {
            event: '*', 
            schema: 'public', 
            table: 'messages'
        }, (payload) => {
            const newPayload = payload.new as Message;
            getRecentMessage(newPayload)
                .then((newRecentMessage) => {
                    if (newRecentMessage !== undefined) {
                        //newRecentMessage.seen = true;
                        // Check if there's an existing chat that matches the sender and recipient IDs
                        const existingChatIndex = realtimePreviews.findIndex((chat) =>
                          (chat.sender_id === newRecentMessage.sender_id && chat.recipient_id === newRecentMessage.recipient_id) ||
                          (chat.sender_id === newRecentMessage.recipient_id && chat.recipient_id === newRecentMessage.sender_id)
                        );
                  
                        if (existingChatIndex !== -1) {
                          // Update the existing chat's preview with the new message
                          setRealtimePreviews((oldArray) => {
                            const newArray = [...oldArray];
                            newArray[existingChatIndex] = newRecentMessage;
                            newArray.splice(existingChatIndex, 1);
                            newArray.unshift(newRecentMessage);
                            //if(newRecentMessage.chat_id && currentPathname.includes(newRecentMessage.chat_id.toString())){
                            //    newRecentMessage.seen = false;
                            //}
                            //else newRecentMessage.seen = true;
                            return newArray;
                          });
                        } else {
                          // If it doesn't match any existing chat, add it as a new chat preview
                          //newRecentMessage.seen = true
                          setRealtimePreviews((oldArray) => [newRecentMessage, ...oldArray]);
                        }
                      }
                })
                .catch((error) => {
                    console.log(error);
                });
        }).subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [supabase, setRealtimePreviews, realtimePreviews, session.user.id, currentPathname, setCurrentPathname])

    const handleDeleteMessages = async(index:number) => {
        if(realtimePreviews && realtimePreviews[index]){
            const chatId = realtimePreviews[index].chat_id;
            if(chatId){
                const {data, error} = await supabase
                .rpc(
                        'delete_chat_for_user',
                        {
                            deletingchat: chatId,
                            deletinguser: session.user.id
                        }
                    )
                if(error) console.log("Error marking chats as deleted: " + error);
                setRealtimePreviews(realtimePreviews.filter((item) => item !== realtimePreviews[index]))
            }
        }
        router.refresh()
        router.push('/messages')
    }

    useEffect(() => {
        // Extract the chatId from the URL
        const chatPath = window.location.href.split('/').pop();
        if(!chatPath) return
        const chatIdFromUrl = chatPath.split("--").pop();
    
        // Find the index of the chat with matching chatId
        const chatIndex = realtimePreviews.findIndex(
          (preview) => preview.chat_id === chatIdFromUrl
        );
    
        // Update the active message if a matching chat is found
        if (chatIndex !== -1) {
          setActivePreview(chatIndex);
        }
      }, [realtimePreviews, router]);

    useEffect(()=>{
        if(realtimePreviews && toRedirect !== null && toRedirect !== undefined)
        {
            //realtimePreviews[toRedirect].seen = false;
            if(realtimePreviews[toRedirect].sender_id && realtimePreviews[toRedirect].recipient_id && realtimePreviews[toRedirect].chat_id){
                const href = `/messages/chat/${chatHrefConstructor(
                    realtimePreviews[toRedirect].sender_id, 
                    realtimePreviews[toRedirect].recipient_id, 
                    realtimePreviews[toRedirect].chat_id
                )}`
                setCurrentPathname(href)
                setActivePreview(toRedirect)
                router.refresh()
                router.push(href)
            } 
        }
    }, [toRedirect])

    useEffect(()=>{
        setCurrentPathname(window.location.href)
    }, [])

    return(
        <div className="h-screen">
            <div className="flex justify-end pr-4 space-x-4">
                <div>
                    <MailMinus
                        className={`items-right top-0 p-1 h-8 w-8 text-midnight hover:bg-midnight rounded-sm hover:text-white`}
                        onClick={() => {
                            deleteMessages ? 
                            setDeleteMessages(false) :
                            setDeleteMessages(true)
                        }}
                    />
                </div>
                <div>
                    <PenSquare
                        className={`items-right top-0 p-1 h-8 w-8 text-midnight hover:bg-midnight rounded-sm hover:text-white`}
                        onClick={()=>{
                            showSearchBar ? 
                            setSearchBar(false) :
                            setSearchBar(true)
                        }}
                    />
                </div>
            </div>
            <div className={`w-full ${showSearchBar ? '' : 'hidden'}`}>
                <hr className=" border-b-2 border-gray-300 my-4" />
                <X
                    className='absolute top-14 text-midnight right-0 hover:bg-midnight rounded-sm hover:text-white'
                    onClick={() => {
                        showSearchBar ? 
                        setSearchBar(false) :
                        setSearchBar(true)
                    }}
                />
                <p className="text-midnight text-sm p-2">
                    Add a new message by the user's username:
                </p>
                <div className="h-4 mb-8">
                    <SearchAddMessage session={session}/>
                </div>
                <hr className=" border-b-2 border-gray-300 my-4" />
            </div>
            <ScrollArea className="h-2/3 overflow-auto">
                {
                realtimePreviews.length === 0 ? 
                    <p className="text-midnight">No recent messages...</p> :
                    realtimePreviews?.map((item, index) => (
                        <div className="hover:drop-shadow-md rounded-lg py-1 w-full" key={index} onClick={()=>setToRedirect(index)}>
                            <div className="flex items-center">
                                {deleteMessages ? 
                                    <div className="w-5/6">
                                        <MessagePreview key={index} item={item} session={session} isActive={activePreview === index}/>
                                    </div>
                                    :
                                    <div className="w-full">
                                        <MessagePreview key={index} item={item} session={session} isActive={activePreview === index}/>
                                    </div>
                                }
                                {
                                    item.deleted_by !== session.user.id ?
                                <div
                                    className={`ml-2 bg-red rounded-full w-6 h-8 flex items-center justify-center text-midnight ${
                                    deleteMessages ? '' : 'hidden'
                                    }`}
                                >
                                    <Dialog.Root key={index}>
                                        <Dialog.Trigger>
                                            <Trash2 key={index}/>
                                        </Dialog.Trigger>
                                        <Dialog.Portal>
                                            <div
                                                style={{ zIndex: 2147483647, position: 'absolute'}}
                                                className=' left-8 top-40'
                                            >
                                                <Dialog.Overlay className="fixed inset-0 bg-darkGreen bg-opacity-50" />
                                                <Dialog.Content className="bg-white border-4 border-midnight rounded-lg p-4 drop-shadow-2xl shadow-xl fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                                    <Dialog.Title className=" font-semibold">Confirm Delete</Dialog.Title>
                                                    <Dialog.Description className="DialogDescription">
                                                        <p>
                                                            Once a chat is deleted from both users, it is unrecoverable.
                                                        </p>
                                                    </Dialog.Description>
                                                    <div style={{ display: 'flex', marginTop: 25, justifyContent: 'space-between' }}>
                                                        <Dialog.Close asChild>
                                                            <Button 
                                                                className="bg-softGreen text-midnight hover:text-white"
                                                                onClick={()=>handleDeleteMessages(index)}
                                                            >
                                                                Yes
                                                            </Button>
                                                        </Dialog.Close>
                                                    
                                                        <Dialog.Close asChild>
                                                            <Button aria-label="Close" className='bg-red text-midnight hover:text-white'>
                                                                Cancel
                                                            </Button>
                                                        </Dialog.Close>
                                                    </div>
                                                </Dialog.Content>
                                            </div>
                                        </Dialog.Portal>
                                    </Dialog.Root>
                                </div>
                                :
                                <div/>
                                }
                            </div>
                        </div>
                    ))
                }
            </ScrollArea>
        </div>
    )
}

export default MessageHistory
