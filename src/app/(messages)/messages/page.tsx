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
    }


    return (
        <div className="flex items-center justify-center h-screen">
            <div className="p-5 text-center text-xl font-bold text-white ml-32 ">
                No chat has been selected.
            </div>
        </div>
    );






};

export default MessagesPage;
