"use client"

import {FC, useState, useRef} from 'react'
import { useToast } from '../ui/use-toast'
import { Button } from '../ui/button'
import { User } from '@supabase/gotrue-js'
import { createClientComponentClient, Session } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/supabase'
import TextAreaAutosize from 'react-textarea-autosize'

interface ChatInputProps{
    chatPartner: string,
    chatId: string,
    session: Session
}

const ChatInput: FC<ChatInputProps> = ({chatPartner, chatId, session}) =>{
    const [input, setInput] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const supabase = createClientComponentClient<Database>()
    const { toast } = useToast()
    const textareaRef = useRef<HTMLTextAreaElement | null>(null)

    const sendMessage = async() => {
        if(!input || input === '') return
        setIsLoading(true)
        setInput('')
        textareaRef.current?.focus()
        try{
            const {data: newMessage,error: messagesError} = await supabase
            .from('messages')
            .insert(
                {
                    chat_id: chatId, 
                    message_content: input, 
                    sender_id: session.user.id,
                    recipient_id: chatPartner
                }
            )
            .select()
            .single()

            if(messagesError)
            {
                console.log(messagesError.message + '\n' + messagesError.hint + '\n' + messagesError.code + '\n' + messagesError.details);
                return;
            }

            //this need to:
            //either update an existing notification if one exists from sender to receiver
            //or create one
            const {data: notificationExists, error: failedToExist} = await supabase
                .from('notifications')
                .select("*")
                .eq('receiving_user', chatPartner)
                .eq('sending_user', session.user.id)
                .single()

            if(notificationExists && notificationExists.sending_user == session.user.id)
            {
                const {error: notificationsError} = await supabase
                    .from("notifications")
                    .update(
                        {
                            message_content: input,
                            message_id: newMessage.id,
                        }
                    )
                    .eq("receiving_user", chatPartner)
                    .eq('sending_user', session.user.id)

                if(notificationsError)
                {
                    console.log(notificationsError.message + '\n' + notificationsError.hint + '\n' + notificationsError.code + '\n' + notificationsError.details)
                    return;
                } 
            }
            else
            {
                const {error: notificationsError} = await supabase
                    .from("notifications")
                    .insert(
                        {
                            message_content: input,
                            message_id: newMessage.id,
                            receiving_user: chatPartner,
                            sending_user: session.user.id
                        }
                    )

                if(notificationsError)
                {
                    console.log(notificationsError.message + '\n' + notificationsError.hint + '\n' + notificationsError.code + '\n' + notificationsError.details)
                    return;
                } 
            }
        } catch(error){
            toast({
                title: "Error",
                description: "Something went wrong. Please try again later.\n" + error,
                variant: 'destructive',
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className='border-t border-gray-300 px-4 pt-4 mb-2 sm:mb-0'>
            <div className='relative flex-1 overflow-hidden rounded-lg shadow-lg ring-1 ring-lightblue-400 focus-within:ring-2'>
                <TextAreaAutosize
                    ref={textareaRef}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault()
                            sendMessage()
                        }
                    }}
                    rows={1}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    className='w-full outline-none resize-none border-0 bg-transparent ring-lightblue-400 text-gray-700 placeholder:text-gray-400 px-3 sm:py-2 sm:text-sm sm:leading-6'
                />
                <div
                    onClick={() => textareaRef.current?.focus()}
                    className='py-2'
                    aria-hidden='true'>
                    <div className='py-px'>
                        <div className='h-9' />
                    </div>
                </div>

                <div className='absolute right-0 bottom-0 flex justify-end py-2 pl-3 pr-2 space-x-2'>
                    <Button isLoading={isLoading} onClick={sendMessage}>
                        Send
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default ChatInput;