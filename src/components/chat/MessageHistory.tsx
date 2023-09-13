'use client'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Database } from "@/types/supabase"
import { FC } from "react"
import MessagePreview from "./MessagePreview"
import { useState, useEffect } from "react"

interface Message{
    created_at: string | null;
    message_content: string | null;
    recipient_id: string | null;
    recipient_username: string | null;
    sender_id: string | null;
}
type nullableMessageArray = Message[] | null

const MessageHistory: FC =()=>{
    const [recentMessages, setRecentMessages] = useState<nullableMessageArray>(null);
    const [messagesCount, setMessagesCount] = useState<number|null>(null);
    const [isLoading, setIsLoading] = useState(false);
    
    useEffect(() => {
        const fetchData = async () => {
            const supabase = await createClientComponentClient<Database>();
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();

            if (sessionError || !session || session.user === null) {
                throw sessionError;
            }

            if (!recentMessages && !isLoading) {
                setIsLoading(true);
                console.log("Getting messages");

                const { data, count, error } = await supabase
                    .from("recent_messages")
                    .select("*", { count: "exact" })
                    .eq('sender_id', session.user.id);

                setIsLoading(false);

                if (error) {
                    console.log(error);
                }

                if (data) {
                    console.log(count);
                    setRecentMessages(data);
                    setMessagesCount(count);
                }
            }
        };

        fetchData();
    }, [recentMessages, isLoading]);
    
    return(
        <div className="container px-2 top-2 bg-white rounded-xl h-screen">
            <Tabs defaultValue="messages" className="py-2 rounded-xl text-transparent">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="messages">Messages</TabsTrigger>
                    <TabsTrigger value="connections">Connections</TabsTrigger>
                </TabsList>
                <TabsContent value="messages">
                    {
                        messagesCount == 0 ? 
                        <div className="text-midnight">No recent messages...</div> :
                        Array.isArray(recentMessages) && recentMessages?.map((item, index) => (
                            <MessagePreview key={index} item={item}/>
                        ))
                    }
                </TabsContent>
                <TabsContent value="connections">
                    <Card>
                        <CardHeader>
                            <CardTitle>Connections</CardTitle>
                        </CardHeader>
                        <CardContent>
                            WTF
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default MessageHistory