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
        try{
            const {error} = await supabase
            .from('messages')
            .insert(
                {
                    chat_id: chatId, 
                    message_content: input, 
                    sender_id: session.user.id,
                    recipient_id: chatPartner
                }
            )
            if(error) console.log(error.message + '\n' + error.hint + '\n' + error.code + '\n' + error.details)
            setInput('')
            textareaRef.current?.focus()
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

    return(
        <div className='border-t border-gray-200 px-4 pt-4 mb-1 sm:mb-0'>
            <div className='relative flex-1 overflow-hidden rounded-lg shadow-lg ring-1 ring-midnight focus-within:ring-2'>
                <TextAreaAutosize
                    ref={textareaRef}
                    onKeyDown={(e)=>{
                        if(e.key === 'Enter' && !e.shiftKey){
                            e.preventDefault()
                            sendMessage()
                        }
                    }}
                    rows={1}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    className='w-full outline-none resize-none border-0 bg-transparent ring-muted text-gray-900 placeholder:text-gray-400 px-2 sm:py-1.5 sm:text-sm sm:leading-6'
                />
                <div
                    onClick={() => textareaRef.current?.focus()}
                    className='py-2'
                    aria-hidden='true'>
                    <div className='py-px'>
                        <div className='h-9' />
                    </div>
                </div>

                <div className='absolute right-0 bottom-0 flex justify-between py-2 pl-3 pr-2'>
                    <div className='flex-shrin-0'>
                        <Button isLoading={isLoading} onClick={sendMessage}>
                            Send
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default ChatInput