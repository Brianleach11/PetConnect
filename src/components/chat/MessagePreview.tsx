'use client'
import {
    Card,
    CardContent,
} from "@/components/ui/card"
import {Session} from '@supabase/auth-helpers-nextjs'

interface MessagePreviewItem {
    chat_id: number | null;
    created_at: string | null;
    message_content: string | null;
    recipient_id: string | null;
    recipient_username: string | null;
    sender_id: string | null;
    sender_username: string | null;
}

function formatDate(dateString : string) {
    const today = new Date();
    const date = new Date(dateString);
  
    if (date.toDateString() === today.toDateString()) {
      // Display only time if it's today
      return date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
    } else {
      // Display both date and time if it's not today
      return (
        date.toLocaleDateString(undefined, { month: "short", day: "numeric" })
      );
    }
}

export default function MessagePreview({item, session}: {item: MessagePreviewItem, session:Session}){
    return(
        <Card className="max-w-1/3">
            <CardContent>
                <p className="text-center">
                    {item.recipient_id === session.user.id ? item.sender_username : item.recipient_username}
                </p>
                <p className="text-sm mx-auto overflow-ellipsis">
                    {item.message_content?.substring(0,37)}
                </p>
                <p className="text-xs text-opacity-50 text-right">
                    {item.created_at !== null ? formatDate(item.created_at) : <></>}
                </p>
            </CardContent>
        </Card>
    )
}