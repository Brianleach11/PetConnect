import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import React from 'react'
import ChatWindow from "@/components/chat/ChatWindow"
import { Database } from '@/types/supabase'

interface PageProps {
  params: {
    chatId: string
  }
}

const page = async ({params}: PageProps) => {
  const supabase = createClientComponentClient<Database>()
  const {data: {session}} = await supabase.auth.getSession()

  const chat = params.chatId.split("--")
  const chatId = parseInt(chat[2])
  const {data: messages} = await supabase.from('chats').select("*").eq("chat_id", chatId)
  //done in middleware?
    //get the chat
    //get the sender, recipient
    //check if the session.user.id == sender || recipient
    //if not redirect them away

  return (
    <div className="px-4 py-2 rounded-3xl fixed right-0 w-2/3 h-screen bg-midnight">
      <div className="container px-2 top-2 bg-white rounded-xl h-full">
        {messages?.map((item, index)=>(
          <ChatWindow chat={chatId} key={index} />
          ))
        }
      </div>
    </div>
  )
}
export default page