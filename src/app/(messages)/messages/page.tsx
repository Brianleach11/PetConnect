// External and Third-Party Imports
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// Internal Imports
import { Database } from '@/types/supabase';
import { chatHrefConstructor } from "@/lib/utils";

export const dynamic = 'force-dynamic';

const MessagesPage = async () => {
    // Initialize the Supabase client
    const supabase = createServerComponentClient<Database>({ cookies });

    // Get session details
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    // Redirect to login if there's no session or if there's an error
    if (!session || sessionError) {
        redirect('/');
        return <div />;
    }

    // Fetch the most recent message that hasn't been deleted
    const { data: recentMessage } = await supabase
        .from("recent_messages")
        .select("*")
        .is('deleted_by', null)
        .or(`recipient_id.eq.${session.user.id}, sender_id.eq.${session.user.id}`)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

    // If a recent message exists, redirect to the relevant chat page
// Always show the message "No chat has been selected"
return (
    <div className="flex items-center justify-center h-screen">
        <div className="p-5 text-center text-xl font-bold text-blue ml-32 ">
            No chat has been selected.
        </div>
    </div>
);






};

export default MessagesPage;
