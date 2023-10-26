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

<<<<<<< HEAD
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
=======
const MessagePreview: FC<MessagePreviewProps> = ({item, session, isActive}) =>{
    if(session.user.id === item.deleted_by){
      return null
    }
    return(
      <Card className={`max-w-1/3 hover:border-2 hover:border-midnight ${isActive ? 'bg-gray bg-opacity-25 drop-shadow-lg border-2 border-midnight': ''}`}>
          <CardContent className="py-2">
            <div className="flex items-center justify-between">
              <p>
                {item.recipient_id === session.user.id ? item.sender_username : item.recipient_username}
              </p>
            </div>
              <p className={`text-sm mx-auto text-midnight text-opacity-80 overflow-ellipsis`}>
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
{item.seen && <div className="bg-softGreen rounded-full px-2 text-xs ml-auto">New</div>}
${item.seen ? 'font-semibold' : ''}
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
>>>>>>> 1fc1f4f7894ba8e02f8a385648faa9fd15dd0e7a
