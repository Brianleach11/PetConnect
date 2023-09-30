import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { ReactNode } from "react"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { Database } from "@/types/supabase"
import NavBar from "@/components/NavBar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronRight } from "lucide-react"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import MessageHistory from "@/components/chat/MessageHistory"
import { ScrollArea } from "@/components/ui/scroll-area"
import ConnectionsList from "@/components/connections/ConnectionsList"
import ConnectionRequestsButton from "@/components/connections/ConnectionRequestsButton"
import SearchAddConnection from "@/components/connections/SearchAddConnection"

interface LayoutProps {
  children: ReactNode
}

const Layout = async({children}: LayoutProps) => {
  const supabase = createServerComponentClient<Database>({cookies})
  const {data: {session}, error: sessionError} = await supabase.auth.getSession()

  if(!session || sessionError) redirect('/')

  /*const {data: messages, error: messagesError, count: messagesCount} = await supabase
        .from('messages')
        .select('*', {count:"exact"})
        .order('recipient_id', {ascending: false})
        */
  const {data: connections, error: connectionsError} = await supabase
        .from("friends")
        .select(`
          id,
          created_at,
          sending_user,
          receiving_user`)
        .or(`receiving_user.eq.${session.user.id}, sending_user.eq.${session.user.id}`)
        .order('created_at', {ascending: false})

  let { data: recentMessages, count: recentMessagesCount, error } = await supabase
        .from("recent_messages")
        .select("*", { count: "exact" })
        .or(`recipient_id.eq.${session.user.id}, sender_id.eq.${session.user.id}`)
        .order('created_at', {ascending:false})

  let {count: unseenConnectionsCount, error: unseenConnectionsError} = await supabase
        .from('friend_requests')
        .select("", {count: "exact"})
        .eq(`receiving_user`, session.user.id)
        .order('created_at', {ascending: false})

  if(!unseenConnectionsCount){
    unseenConnectionsCount = 0
  }
  if(!recentMessagesCount){
    recentMessagesCount = 0
  }

  return(
    <div className='h-screen bg-whiteGreen w-full fixed'>
        <NavBar session={session} authToken={false}/>
        <div className='h-screen pt-12'>
          <div className='px-4 py-2 rounded-3xl fixed left-0 w-1/3 h-screen bg-midnight'>
            <div className="container px-2 bg-white rounded-xl h-full">
              <Tabs defaultValue="messages" className="py-2 rounded-xl text-transparent">
                  <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="messages">Messages</TabsTrigger>
                      <TabsTrigger value="connections">Connections</TabsTrigger>
                  </TabsList>
                  <TabsContent value="messages">
                    <ScrollArea>
                      <MessageHistory session={session} recentMessages={recentMessages ?? []} recentMessagesCount={recentMessagesCount}/>
                    </ScrollArea>
                  </TabsContent>
                  <TabsContent value="connections">
                    <p className="text-midnight text-sm p-2">
                      Add a new user by their username:
                    </p>
                    <div className="h-4 mb-8">
                      <SearchAddConnection session={session}/>
                    </div>
                    <hr className=" border-b-2 border-gray-300 my-4" />
                    <div className="mb-4">
                      <ConnectionRequestsButton unseenConnectionsCount={unseenConnectionsCount}/>
                    </div>
                    <hr className=" border-b-2 border-gray-300 my-4" />
                    <ScrollArea>
                      <ConnectionsList session={session} connections={connections}/>
                    </ScrollArea>
                  </TabsContent>
              </Tabs>
            </div>
          </div>
          {children}
        </div>
    </div>
  )
}
export default Layout
