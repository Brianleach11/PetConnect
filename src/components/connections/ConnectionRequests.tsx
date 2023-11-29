'use client'

// Internal imports
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import OneRequest from "./OneRequest";
import { ScrollArea } from "../ui/scroll-area";

// Third-party imports
import { FC } from "react";
import { Session } from "@supabase/auth-helpers-nextjs";

interface Connection {
    created_at: string;
    id: number;
    receiving_user: string;
    sending_user: string;
}

type nullableConnections = Connection[] | null;

interface ConnectionRequestsProps {
    unseenConnections: nullableConnections;
    unseenConnectionsCount: number;
    session: Session;
}

const ConnectionRequests: FC<ConnectionRequestsProps> = ({ unseenConnections, unseenConnectionsCount, session }) => {
    const requestsSent = unseenConnections?.filter(item => item.sending_user === session.user.id).length || 0;
    const requestsReceived = unseenConnectionsCount - requestsSent;

    return (
        <Card className="h-full flex flex-col border-none">
            <CardHeader className="text-2xl font-semibold my-4 border-b-4 w-full items-center">
                Connection Requests
            </CardHeader>
            
            {unseenConnectionsCount > 0 ? (
                <CardContent className="items-left grid grid-rows-2 w-full h-full">
                    <section className="h-3/4">
                        <CardTitle className="my-2 text-lg pr-4">
                            Incoming Connection Requests [{requestsReceived}]
                        </CardTitle>
                        <ScrollArea className="h-48 border-2 border-midnight rounded-lg space-x-4">
                            {unseenConnections?.map((item, index) => (
                                item.receiving_user === session.user.id &&
                                <OneRequest session={session} item={item} key={index} />
                            ))}
                        </ScrollArea>
                    </section>

                    <section className="w-full h-3/4 -mt-10 overflow-hidden">
                        <CardTitle className="my-2 text-lg">
                            Pending Connections Sent [{requestsSent}]
                        </CardTitle>
                        <ScrollArea className="h-48 border-2 border-midnight rounded-lg space-x-4">
                            {unseenConnections?.map((item, index) => (
                                item.sending_user === session.user.id && 
                                <OneRequest session={session} item={item} key={index} />
                            ))}
                        </ScrollArea>
                    </section>
                </CardContent>
            ) : (
                <CardDescription className="my-4">
                    You have no incoming or outgoing requests.
                </CardDescription>
            )}
        </Card>
    );
}

export default ConnectionRequests;
