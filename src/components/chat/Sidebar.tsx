'use client'
import { FC } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import MessageHistory from "./MessageHistory";
import ConnectionRequestsButton from "../connections/ConnectionRequestsButton";
import ConnectionsList from "../connections/ConnectionsList";
import { Session } from "@supabase/gotrue-js";

interface SidebarProps {
    session: Session,
    recentMessages: recentMessages,
    unseenConnectionsCount: number,
    connections: connections,
    recentMessagesCount: number,
}

interface Messages {
    chat_id: string | null;
    created_at: string | null;
    deleted_by: string | null;
    message_content: string | null;
    recipient_id: string | null;
    recipient_username: string | null;
    sender_id: string | null;
    sender_username: string | null;
}
type recentMessages = Messages[] | null

interface Connection {
    id: number;
    created_at: string;
    sending_user: string;
    receiving_user: string;
}
type connections = Connection[] | null;

const Sidebar: FC<SidebarProps> = ({ session, recentMessages, unseenConnectionsCount, connections, recentMessagesCount }) => {
    return (
        <div className='py-2 pt-14 fixed left-0 h-screen w-screen'>
            <div className="container px-2 bg-white lg:rounded-tl-xl h-full">
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
    )
}

export default Sidebar;