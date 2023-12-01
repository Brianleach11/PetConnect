"use client"

import { FC, useEffect, useState, useRef, useCallback } from "react";
import { Expand } from "lucide-react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from 'uuid';
import { Session, createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import MessagePreview from "./MessagePreview";
import { chatHrefConstructor } from "@/lib/utils";
import { ScrollArea } from "@radix-ui/react-scroll-area";

interface RecentMessages {
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

interface ChatDropDownMenuProps {
    session: Session | null;
    isOpen: boolean;
    onClose: () => void;
}


const ChatDropDownMenu: FC<ChatDropDownMenuProps> = ({ session, isOpen, onClose }) => { // Ensure `onClose` is destructured here.
    const router = useRouter();
    const supabase = createClientComponentClient();
    const [messages, setMessages] = useState<RecentMessages[]>([]);
    const dropdownRef = useRef<HTMLDivElement>(null); // Explicitly setting the ref type


    const fetchAllChats = async () => {
        if (!session) return;

        const { data, error } = await supabase
            .from('recent_messages')
            .select('*')
            .or(`recipient_id.eq.${session.user.id},sender_id.eq.${session.user.id}`)
            .order('created_at', { ascending: false })
            .limit(5);

        if (error) {
            console.error("Error fetching chats:", error);
            return;
        }

        setMessages(data || []);
    };

    const handleClickOutside = (e: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
            onClose(); // Inform the parent to close the dropdown
        }
    };


    useEffect(() => {
        fetchAllChats();

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [session, isOpen]);

    const handleChatClick = (message: RecentMessages) => {
        if (message.sender_id && message.recipient_id && message.chat_id) {
            const href = `/messages/chat/${chatHrefConstructor(
                message.sender_id,
                message.recipient_id,
                message.chat_id
            )}`;
            router.push(href);
        }
    }

    return (
        <div className="relative">
            {/* Dropdown Content */}
            {isOpen && (
                <div ref={dropdownRef} className="absolute right-0 top-full mt-2 w-96 max-w-screen rounded-md shadow-lg bg-white overflow bg-opacity-100">
                    <div className="flex justify-between items-center borer-b border-gray p-5 ">
                        <span className="font-semibold text-xl">Chat</span>
                        <button onClick={() => {
                            router.push("/messages")
                            onClose()
                        }} className="p-2 rounded-md">
                            <Expand className="w-6 h-6 cursor-pointer" />
                        </button>
                    </div>
                    <ScrollArea className=" h-96 overflow-y-auto">
                        {messages.length > 0 ? (
                            messages.map((message) => (
                                <div key={message.created_at}
                                    className="hover:bg-whiteGreen cursor-pointer p-3 border-b border-whiteGreen last:border-b-0"
                                    onClick={() => handleChatClick(message)}>
                                    <div className="w-full py-1/2">
                                        {message && session && <MessagePreview item={message} session={session} isActive={false} />}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-5 text-center text-gray-500 text-lg">
                                No chats available.
                            </div>
                        )}
                    </ScrollArea>
                </div>
            )}
        </div>
    );




}

export default ChatDropDownMenu;



