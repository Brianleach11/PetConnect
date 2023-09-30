import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import React from 'react'
import ChatWindow from "@/components/chat/ChatWindow"
import { Database } from '@/types/supabase'
import ChatInput from '@/components/chat/ChatInput'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

interface PageProps {
  params: {
    chatId: string
  }
}

const page = async ({params}: PageProps) => {
  const supabase = createServerComponentClient<Database>({cookies})
  const {data: {session}, error: sessionError} = await supabase.auth.getSession()

  if(!session || sessionError) {
    console.log("Chat Page.tsx redirecting to home")
    redirect("/")
  }

  const chatProps = params.chatId.split("--")
  const chatId = chatProps[2]
  const user1 = chatProps[0]
  const user2 = chatProps[1]

  let chatPartner = (session.user.id === user1) ? user2: user1;

  const {data} = await supabase
    .from('recent_messages')
    .select('*')
    .eq('chat_id', chatId)
    .single()

  if(data && data.deleted_by === session.user.id) redirect('/messages')
  
  const chatPartnerUsername = (data?.recipient_id === chatPartner) ? data.recipient_username : data?.sender_username
  let {data: chats} = await supabase.from('chats').select("*").eq('chat_id', chatId)
  chats?.reverse()

  return (
    <div className="px-4 py-2 rounded-3xl fixed right-0 w-2/3 h-screen bg-midnight">
      <div className="container px-2 top-2 bg-white rounded-xl h-full">
        <div className='flex-1 justify-between flex flex-col h-full max-h-[calc(100vh-6rem)]'>
          <div className='flex sm:items-center justify-between py-3 border-b-2 border-gray-200 mb-1'>
            <div className='relative flex items-center space-x-4'>
              <div className='relative'>
                <div className='relative w-8 sm:w-12 h-8 sm:h-12'>
                </div>
              </div>

              <div className='flex flex-col leading-tight'>
                <div className='text-l flex items-center'>
                  <span className='text-gray-700 mr-3 font-medium'>
                    {chatPartnerUsername}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <ChatWindow session={session} initialChats={chats ?? []}/>
          <div className="mb-4">
            <ChatInput session={session} chatId={chatId} chatPartner={chatPartner}/>
          </div>
        </div>
      </div>
    </div>
  )
}
export default page