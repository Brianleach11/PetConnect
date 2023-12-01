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

const MessagePreview: FC<MessagePreviewProps> = ({ item, session, isActive }) => {
    const [hasUnseenNotification, setHasUnseenNotification] = useState(false);
    const supabase = createClientComponentClient<Database>();
    const [avatarUrl, setAvatarUrl] = useState<string>(""); // State to store avatar URL

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

    // Function to fetch avatar URL
    const fetchAvatar = async (userId: string) => {
        try {
            const { data } = await supabase
                .from('user')
                .select('defaultAvatar')
                .eq('id', userId)
                .select()
                .single();
            if (data?.defaultAvatar) {
                setAvatarUrl(data?.defaultAvatar)
                return;
            }

            const response = await fetch(`/api/getUserAvatar?userId=${userId}`);
            if (!response.ok) throw new Error('Failed to fetch avatar');

            const images = await response.json();
            if (!images || !images.at(0)) throw new Error('No avatar image found');

            const baseUrl = process.env.NEXTCLOUD_USERAVATAR_URL; // Adjust this to your environment
            const imageUrl = `${baseUrl}/${encodeURIComponent(userId)}/${encodeURIComponent(images.at(0).basename)}&x=1280&y=720&a=true`;

            setAvatarUrl(imageUrl);
        } catch (error) {
            console.error('Error fetching avatar:', error);
            // Set the specified image as the default avatar
            setAvatarUrl('https://i.pinimg.com/564x/67/81/e2/6781e2acffe6af95cd30a705714ed653.jpg');
        }
    };


    useEffect(() => {
        const userId = item.recipient_id === session.user.id ? item.sender_id : item.recipient_id;
        if (userId) fetchAvatar(userId);
    }, [item, session.user.id]);

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
        <Card className={`w-full md:max-w-1/2 lg:max-w-1/3 hover:shadow-lg overflow-clip transition-transform transform hover:-translate-y-1 rounded-lg ${
            isActive ? 'border border-midnight' : ''
        }`} onClick={handleCardClick}>
            <CardContent className="py-2 relative">
                <div className="flex items-start space-x-3">
                    {/* Avatar */}
                    <img
                        src={avatarUrl}
                        alt="Avatar"
                        loading="eager"
                        className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full object-cover"
                    />
        
                    {/* Text Content */}
                    <div>
                        <h3 className="text-base md:text-lg font-bold">
                            {item.recipient_id === session.user.id ? item.sender_username : item.recipient_username}
                        </h3>
                        <p className={`text-xs sm:text-sm text-gray-700 truncate ${hasUnseenNotification ? 'font-medium' : ''}`}>
                            {item.message_content?.substring(0, 20)}
                        </p>
                        <p className="text-xs text-gray-400">
                            {item.created_at !== null ? formatDate(item.created_at) : null}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default MessagePreview;