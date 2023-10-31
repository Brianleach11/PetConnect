'use client'
import Link from "next/link";
import Image from "next/image";
import { buttonVariants } from "./ui/button";
import { Session, createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import {useRouter} from 'next/navigation'
import { useState, useEffect, useRef, RefObject } from 'react';
import ProfileDropdown from "./ProfileDropdown";
import { Check,X } from "lucide-react"
import { Bell } from 'lucide-react';
import ChatDropDownMenu from "./chat/ChatDropDownMenu";
import { MessagesSquare } from 'lucide-react';


//initial session, null. Until manual refresh when session isnt null
type FriendRequestNotification = {
  sending_user: string; 
  created_at: string;
  username?: string; // New field to store the username
};


function timeSince(date: string | Date): string {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
  let interval = Math.floor(seconds / 31536000);

  if (interval > 1) {
      return interval + " years ago";
  }
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) {
      return interval + " months ago";
  }
  interval = Math.floor(seconds / 86400);
  if (interval > 1) {
      return interval + " days ago";
  }
  interval = Math.floor(seconds / 3600);
  if (interval > 1) {
      return interval + " hours ago";
  }
  interval = Math.floor(seconds / 60);
  if (interval > 1) {
      return interval + " minutes ago";
  }
  return "just now";
}

export const useOutsideClick = (ref: RefObject<HTMLElement | null>, callback: () => void, ignoreRef?: RefObject<HTMLElement | null>) => {
  const handleClickOutside = (event: MouseEvent) => {
      if (ignoreRef?.current && ignoreRef.current.contains(event.target as Node)) {
          return;
      }
      if (ref.current && !ref.current.contains(event.target as Node)) {
          callback();
      }
  };

  useEffect(() => {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
          document.removeEventListener('mousedown', handleClickOutside);
      };
  }, [ref, callback]);
};
export default function NavBar({session, authToken}: {session: Session | null, authToken: boolean}) {

  const supabase = createClientComponentClient()
  const router = useRouter()
  const [notifications, setNotifications] = useState<FriendRequestNotification[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [username, setUsername] = useState<string>("")
  const [unreadMessagesCount, setUnreadMessagesCount] = useState<number>(0);
  const [showChatDropdown, setShowChatDropdown] = useState(false);
  const notificationBtnRef = useRef(null);
  const notificationDropdownRef = useRef(null);

  const [isChatMenuOpen, setIsChatMenuOpen] = useState(false);

  const toggleChatMenu = () => {
      setIsChatMenuOpen(prevState => !prevState);
  };


  useEffect(()=>{
    if(authToken){
      router.refresh()
    }
  })

  const fetchFriendRequests = async () => {
    const { data, error } = await supabase
        .from('friend_requests')
        .select('sending_user, created_at')
        .eq('receiving_user', session?.user?.id);

    if (error) {
        console.error("Error fetching friend requests:", error);
        return;
    }

    // Iterate over each notification and fetch the username for the sending_user
    const notificationsWithUsernames = await Promise.all(data.map(async (notification) => {
        const userData = await supabase
            .from('user')
            .select('username')
            .eq('id', notification.sending_user)
            .single();

        return {
            ...notification,
            username: userData.data?.username || 'Unknown User'
        };
    }));

    setNotifications(notificationsWithUsernames);
};


useEffect(() => {
  const friendRequestChannel = supabase.channel('notification_friend_requests').on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'friend_requests'
  }, (payload) => {
    fetchFriendRequests();
  }).subscribe();

  return () => {
    supabase.removeChannel(friendRequestChannel);
  };
}, [session]);

  const acceptRequest = async (sending_user: string, receiving_user: string) => {
    const { error: insertError } = await supabase
      .from('friends')
      .insert([
        {
          sending_user: sending_user,
          receiving_user: receiving_user,
        },
      ]);

    const { error: deleteError } = await supabase
      .from('friend_requests')
      .delete()
      .eq('sending_user', sending_user)
      .eq('receiving_user', receiving_user);

    if (insertError) console.log("INSERT ERROR: " + insertError);
    if (deleteError) console.log("DELETE ERROR: " + deleteError);

    // Refresh the notifications
    fetchFriendRequests();
  };

  const rejectRequest = async (sending_user: string, receiving_user: string) => {
    const { error } = await supabase
      .from('friend_requests')
      .delete()
      .eq('sending_user', sending_user)
      .eq('receiving_user', receiving_user);
    if (error) console.log("DELETE ERROR: " + error);

    // Refresh the notifications
    fetchFriendRequests();
  };


  const handleNotificationClick = () => {
    // Redirect to the sender's profile
    router.push(`/profile/`);
  };

  const fetchUnreadMessagesCount = async () => {

    if (!session) return;
  
    const { data, error } = await supabase
      .from('recent_messages')
      .select('*') // Fetch all columns as you mentioned
      .eq('recipient_id', session.user.id);
      console.log("after supabase call" + data?.length);

    if (error) {
      console.error("Error fetching notifications:", error);
      return;
    }
  
    setUnreadMessagesCount(data?.length);
  };
  
  
  const navigateToMessages = async () => {
    const { error } = await supabase
    .from('unread_messages')
    .delete()
    .eq('recipient_id', session?.user?.id);
  
  if (error) {
      console.error("Error deleting unread messages:", error);
  }
  
    if (session) {
      setUnreadMessagesCount(0);
      router.push("/messages");
    }
  };
  
  

  useEffect(() => {
    if (session) {
      fetchFriendRequests();  // fetch friend requests when component mounts
      fetchUnreadMessagesCount(); // fetch unread messages when component mounts
    }
  }, [session]);

  // Call the custom hook for the notification dropdown
  useOutsideClick(notificationDropdownRef, () => {
    if (showDropdown) setShowDropdown(false);
}, notificationBtnRef);


 return (
    <>
      <div className='fixed top-0 inset-x-0 h-fit bg-softGreen z-[10] py-2'>
        <div className='container max-w-7xl h-full mx-auto flex items-center justify-between gap-2'>
          <Link href='/' className='flex gap-2 items-center'>
            <Image src="/assets/logo.png" priority width={75} height={75} alt="Logo"/>
            <p className='hidden text-zinc-700 text-3xl font-large font-bold md:block'>Pet Connect</p>
          </Link>
          <Link href={session ? "/pets": {}} className={buttonVariants({variant: "ghost"})}>Posts</Link>
          <Link href={session ? "/maps": {}} className={buttonVariants({variant: "ghost"})}>Maps</Link>
          <div className="relative">
          <button 
            onClick={toggleChatMenu} 
            className={buttonVariants({variant: "ghost"})} 
            style={{ position: 'relative' }}
              >
              <MessagesSquare className="w-full h-6 text-gray-600" />
              {unreadMessagesCount > 0 && (
                <span className="absolute top-[-10px] right-[-10px] inline-block w-5 h-5 text-xs font-bold text-center leading-5 rounded-full bg-red text-white shadow-lg">
                  {unreadMessagesCount}
                </span>
              )}
            </button>
            <ChatDropDownMenu 
            session={session}
              isOpen={isChatMenuOpen}
              onClose={() => setIsChatMenuOpen(false)} // directly close the chat menu
            />
          </div>
          {session && (
            <div className="relative" ref={notificationBtnRef}>
              <button onClick={() => setShowDropdown(!showDropdown)} className="relative p-2 rounded-md hover:bg-white transition-all ">
                <Bell className="w-6 h-6 text-gray-600" />
                {notifications.length > 0 && (
                  <span className="absolute top-[-10px] right-[-10px] inline-block w-5 h-5 text-xs font-bold text-center leading-5 rounded-full bg-red text-white shadow-lg">
                    {notifications.length}
                  </span>
                )}
              </button>
              {showDropdown && (
                <div className="absolute top-full mt-2 right-0 w-[1000%] max-w-screen-xl rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 overflow-hidden" ref={notificationDropdownRef}>
                  <div className="flex justify-between items-center border-b border-gray-200 p-5 bg-gray-50">
                    <span className="font-semibold text-xl">Notifications</span>
                  </div>
                  {notifications.length > 0 ? (
                    notifications.map(notification => (
                      <div key={notification.created_at} className="border-b-2 flex justify-between items-center p-5">
                        <div className="w-5/6">
                          <span className="font-bold">{notification.username}</span>
                          <div className="text-merleBlue" style={{ fontSize: '0.8rem' }}>
                            {timeSince(new Date(notification.created_at))}
                          </div>
                        </div>
                        <div className="flex items-center">
                          {notification.sending_user !== session.user.id ? (
                            <span onClick={() => acceptRequest(notification.sending_user, session.user.id)}>
                              <Check className="bg-softGreen rounded-full w-7 h-7 flex items-center justify-center hover:shadow-lg hover:ring-2 hover:ring-midnight" />
                            </span>
                          ) : null}
                          <span onClick={() => rejectRequest(notification.sending_user, session.user.id)} className="ml-3">
                            <X className="bg-red rounded-full w-7 h-7 flex items-center justify-center hover:shadow-lg hover:ring-2 hover:ring-midnight" />
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-5 text-center text-gray-500 text-lg">
                      You have no incoming requests.
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {session ? <ProfileDropdown/> : <Link href="/login" className={buttonVariants()}>Sign In</Link>}
        </div>
      </div>
    </>
  );
};
