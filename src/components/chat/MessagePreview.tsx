'use client'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

interface MessagePreviewItem {
    recipient_username: string | null;
    message_content: string | null;
    created_at: string | null;
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

export default function MessagePreview({item}: {item: MessagePreviewItem}){
    return(
        <Card>
            <CardContent>
                <p className="text-center">
                    {item.recipient_username}
                </p>
                <p className="text-sm">
                    {item.message_content?.substring(0,37)}...
                </p>
                <p className="text-xs text-opacity-50 text-right">
                    {item.created_at !== null ? formatDate(item.created_at) : <></>}
                </p>
            </CardContent>
        </Card>
    )
}