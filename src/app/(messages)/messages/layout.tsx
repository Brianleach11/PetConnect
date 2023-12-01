import { ReactNode } from "react"
import { redirect } from "next/navigation"
import NavBar from "@/components/NavBar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import MessageHistory from "@/components/chat/MessageHistory"
import ConnectionsList from "@/components/connections/ConnectionsList"
import ConnectionRequestsButton from "@/components/connections/ConnectionRequestsButton"
import Sidebar from "@/components/chat/Sidebar"
import supabaseServer from '@/components/supabaseServer';

interface LayoutProps {
  children: ReactNode
}

const Layout = async ({ children }: LayoutProps) => {
  const { data: { session }, error: sessionError } = await supabaseServer().auth.getSession()

  if (!session || sessionError) redirect('/')

  const { data: connections, error: connectionsError } = await supabaseServer()
    .from("friends")
    .select(`
          id,
          created_at,
          sending_user,
          receiving_user`)
    .or(`receiving_user.eq.${session.user.id}, sending_user.eq.${session.user.id}`)
    .order('created_at', { ascending: false })

  let { data: recentMessages, count: recentMessagesCount, error } = await supabaseServer()
    .from("recent_messages")
    .select("*", { count: "exact" })
    .or(`recipient_id.eq.${session.user.id}, sender_id.eq.${session.user.id}`)
    .order('created_at', { ascending: false })

  let { count: unseenConnectionsCount, error: unseenConnectionsError } = await supabaseServer()
    .from('friend_requests')
    .select("", { count: "exact" })
    .eq(`receiving_user`, session.user.id)
    .order('created_at', { ascending: false })

  if (!unseenConnectionsCount) {
    unseenConnectionsCount = 0
  }
  if (!recentMessagesCount) {
    recentMessagesCount = 0
  }

  return (
    //large screens needs to display both the sidebar component and the page
    //small screens is only the page and menu button
    <div className='h-screen -mt-12 bg-midnight w-full fixed'>
      <NavBar session={session} authToken={false} />
      <div className='h-screen bg-midnight mt-10'>
        {/*here*/}
        <div className="lg:hidden">
          <Sidebar session={session} recentMessages={recentMessages} connections={connections} unseenConnectionsCount={unseenConnectionsCount} recentMessagesCount={recentMessagesCount}/>
        </div>
        <div className="hidden lg:block">
          <div className='py-2 pt-14 fixed left-0 w-1/3 h-screen'>
            <div className="container px-2 bg-white rounded-tl-xl h-full">
              <Tabs defaultValue="messages" className="py-2 rounded-xl text-transparent">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="messages">Messages</TabsTrigger>
                  <TabsTrigger value="connections">Connections</TabsTrigger>
                </TabsList>
                <TabsContent value="messages">
                  <MessageHistory session={session} recentMessages={recentMessages ?? []} recentMessagesCount={recentMessagesCount} />
                </TabsContent>
                <TabsContent value="connections">
                  <div className="mb-4">
                    <ConnectionRequestsButton unseenConnectionsCount={unseenConnectionsCount} />
                  </div>
                  <hr className=" border-b-2 border-gray-300 my-4" />
                  <ConnectionsList session={session} connections={connections} />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
        {children}
      </div>
    </div>
  )
}
export default Layout
