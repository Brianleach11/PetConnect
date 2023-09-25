'use client'
import {FC} from 'react'
import { createClientComponentClient, Session } from '@supabase/auth-helpers-nextjs'
import ConnectionPreview from './ConnectionPreview'

interface Connections {
    id: number;
    created_at: string;
    sending_user: string | null;
    receiving_user: string | null;
}
type nullableConnections = Connections[] | null

interface ConnectionsListProps{
    session: Session,
    connections: nullableConnections,
}

const ConnectionsList:FC<ConnectionsListProps> = async({session, connections})=> {
    let numConnections = connections?.length
    if(!numConnections || numConnections === undefined) numConnections = 0
    return (
        <div>
            {
            numConnections === 0 ? 
                <div className="text-midnight">No connections to display...</div> :
                connections?.map((item, index) => (
                    <div className="hover:drop-shadow-md rounded-lg py-1" key={index}>
                        <ConnectionPreview key={index} item={item} session={session}/>
                    </div>
                ))
            }
        </div>
    )
}

export default ConnectionsList