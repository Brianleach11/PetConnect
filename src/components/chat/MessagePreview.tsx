'use client'
import { Card, CardContent } from "@/components/ui/card";
import { Session } from '@supabase/auth-helpers-nextjs';
import { FC } from "react";
import { ChevronUp } from "lucide-react";

export interface MessagePreviewItem {
    chat_id: string | null;
    created_at: string | null;
    message_content: string | null;
    recipient_id: string | null;
    recipient_username: string | null;
    sender_id: string | null;
    sender_username: string | null;
    deleted_by: string | null;
    seen: boolean;
}

interface MessagePreviewProps {
    session: Session,
    item: MessagePreviewItem,
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
    if (session.user.id === item.deleted_by) {
        return null;
    }

    return (
        <Card className="max-w-1/3 hover:shadow-lg transition-transform transform hover:-translate-y-1 hover:border-midnight p-4 rounded-lg">
            <CardContent className="py-2">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-lg">
                        {item.recipient_id === session.user.id ? item.sender_username : item.recipient_username}
                    </h3>
                    {item.seen && <span className="bg-softGreen text-white rounded-full px-2 py-1 text-xs font-semibold ml-auto">New</span>}
                </div>
                <p className={`text-sm text-gray-700 overflow-ellipsis ${item.seen ? 'font-medium' : ''}`}>
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
