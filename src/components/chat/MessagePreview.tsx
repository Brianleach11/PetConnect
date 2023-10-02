'use client'
import {
    Card,
    CardContent,
} from "@/components/ui/card"
import {Session} from '@supabase/auth-helpers-nextjs'
import { UUID } from "crypto";
import { FC } from "react";
import { ChevronUp } from "lucide-react";

interface MessagePreviewItem {
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
interface MessagePreviewProps{
    session: Session,
    item: MessagePreviewItem,
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

const MessagePreview: FC<MessagePreviewProps> = ({item, session}) =>{
    if(session.user.id === item.deleted_by){
      return null
    }
    return(
        <Card className="max-w-1/3 hover:border-2 hover:border-midnight">
            <CardContent>
              <div className="flex items-center justify-center">
                <p>
                  {item.recipient_id === session.user.id ? item.sender_username : item.recipient_username}
                </p>
                {item.seen && <div className="bg-softGreen rounded-full px-2 text-xs">New</div>}
              </div>
                <p className={`text-sm mx-auto overflow-ellipsis ${item.seen ? 'font-semibold' : ''}`}>
                    {item.message_content?.substring(0,37)}
                </p>
                <p className="text-xs text-opacity-50 text-right">
                    {item.created_at !== null ? formatDate(item.created_at) : <></>}
                </p>
            </CardContent>
        </Card>
    )
}

export default MessagePreview

/*
create view
  public.chats as
select
  m.chat_id,
  m.created_at,
  m.sender_id,
  m.recipient_id,
  m.message_content
from
  (
    select
      messages.chat_id,
      min(messages.created_at) as min_created_at
    from
      messages
    group by
      messages.chat_id
  ) c
  join messages m on c.chat_id = m.chat_id
order by
  c.chat_id,
  m.created_at;
  
  
  create view
  public.recent_messages as
select distinct
  on (m.chat_id) m.chat_id,
  m.sender_id,
  s.username as sender_username,
  m.recipient_id,
  u.username as recipient_username,
  m.message_content,
  m.created_at
from
  messages m
  left join "user" s on m.sender_id = s.id
  left join "user" u on m.recipient_id = u.id
order by
  m.chat_id,
  m.created_at desc;*/