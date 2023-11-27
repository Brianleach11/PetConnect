'use client'
import { Card, CardContent } from "@/components/ui/card";
import { Session } from '@supabase/auth-helpers-nextjs';
import { FC } from "react";
import { ChevronUp } from "lucide-react";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import React, { useEffect, useState } from 'react';

export interface MessagePreviewItem {
    chat_id: string | null;
    created_at: string | null;
    message_content: string | null;
    recipient_id: string | null;
    recipient_username: string | null;
    sender_id: string | null;
    sender_username: string | null;
    deleted_by: string | null;
    //seen: boolean;
}

interface MessagePreviewProps {
    session: Session,
    item: MessagePreviewItem,
    isActive: boolean,
}


function formatDate(dateString: string) {
    const today = new Date();
    const date = new Date(dateString);

    if (date.toDateString() === today.toDateString()) {
        return date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
    } else {
        return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
    }
}

const MessagePreview: FC<MessagePreviewProps> = ({ item, session }) => {
    const [hasUnseenNotification, setHasUnseenNotification] = useState(false);
    const supabase = createClientComponentClient<Database>();

    useEffect(() => {
        async function fetchNotifications() {
            if (!session.user.id || !item.message_content) return; 
    
            const { data, error } = await supabase
                .from('notifications')
                .select('*')
                .eq('receiving_user', session.user.id)
                .eq('message_content', item.message_content)
    
            if (data && data.length > 0) {
                setHasUnseenNotification(true);
            }
        }
        fetchNotifications();
    }, [session.user.id, item.message_content]);
    
    

    const handleCardClick = async () => {
        setHasUnseenNotification(false);
        if (!session.user.id || !item.sender_id) return;

        await supabase
            .from('notifications')
            .delete()
            .eq('receiving_user', session.user.id)
            .eq('sending_user', item.sender_id)
    }

   
    return (
        <Card className="max-w-1/3 hover:shadow-lg transition-transform transform hover:-translate-y-1 hover:border-midnight p-4 rounded-lg" onClick={handleCardClick}>
            <CardContent className="py-2">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-lg">
                        {item.recipient_id === session.user.id ? item.sender_username : item.recipient_username}
                    </h3>
                    {hasUnseenNotification && <span className="bg-softGreen text-white rounded-full px-2 py-1 text-xs font-semibold ml-auto">New</span>}
                </div>
                <p className={`text-sm text-gray-700 overflow-ellipsis ${hasUnseenNotification ? 'font-medium' : ''}`}>
                    {item.message_content?.substring(0, 37)}
                </p>
                <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-gray-400">
                        {item.created_at !== null ? formatDate(item.created_at) : null}
                    </p>
                    <ChevronUp size={20} className="text-midnight" />
                </div>
            </CardContent>
        </Card>
    )
}

export default MessagePreview;
