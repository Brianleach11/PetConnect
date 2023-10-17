'use client'
import Link from "next/link";
import Image from "next/image";
import { buttonVariants } from "./ui/button";
import { Session, createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import {useRouter} from 'next/navigation'
import { useState, useEffect, useRef } from 'react';
import ProfileDropdown from "./ProfileDropdown";
import { Check,X } from "lucide-react"
import { Bell } from 'lucide-react';


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



export default function NavBar({session, authToken}: {session: Session | null, authToken: boolean}) {

  const supabase = createClientComponentClient()
  const router = useRouter()
  const [notifications, setNotifications] = useState<FriendRequestNotification[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [username, setUsername] = useState<string>("")



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
    if (session) {
        fetchFriendRequests();
    }
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
          <Link href={session ? "/messages": {}} className={buttonVariants({variant: "ghost"})}>Messages</Link>

          {session && (
  <div className="relative">
    <button onClick={() => setShowDropdown(!showDropdown)} className="relative p-2 rounded-md hover:bg-white transition-all ">
      <Bell className="w-6 h-6 text-gray-600" />
      {notifications.length > 0 && (
        <span className="absolute top-[-10px] right-[-10px] inline-block w-5 h-5 text-xs font-bold text-center leading-5 rounded-full bg-red text-white shadow-lg">
          {notifications.length}
        </span>
      )}
    </button>
    {showDropdown && (
      <div className="absolute right-0 mt-2 w-60 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 overflow-hidden">
        {notifications.length > 0 ? (
          notifications.map(notification => (
            <div key={notification.created_at} className="border-b-2 flex justify-between items-center p-3">
              <div>
                <span className="font-bold">{notification.username}</span>
                <div className="text-merleBlue" style={{ fontSize: '0.6rem' }}>
                    {timeSince(new Date(notification.created_at))}
                </div>
              </div>
              <div className="flex items-center">
                {notification.sending_user !== session.user.id ? (
                  <span onClick={() => acceptRequest(notification.sending_user, session.user.id)}>
                    <Check className="bg-softGreen rounded-full w-6 h-6 flex items-center justify-center hover:shadow-lg hover:ring-2 hover:ring-midnight" />
                  </span>
                ) : null}
                <span onClick={() => rejectRequest(notification.sending_user, session.user.id)} className="ml-2">
                  <X className="bg-red rounded-full w-6 h-6 flex items-center justify-center hover:shadow-lg hover:ring-2 hover:ring-midnight" />
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="p-4 text-center">
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