// External and Third-Party Imports
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { FC } from 'react';

// Internal Imports
import { Database } from '@/types/supabase';
import ConnectionRequests from '@/components/connections/ConnectionRequests';

const ConnectionRequestsPage: FC = async () => {
    // Initialize the Supabase client
    const supabase = createServerComponentClient<Database>({ cookies });

    // Fetch session details
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    // Redirect if there's no session or if there's an error
    if (!session || sessionError) {
        redirect('/');
        return <div />;
    }

    // Fetch unseen connection requests
    const { data: unseenConnections, count: unseenConnectionsCount } = await supabase
        .from('friend_requests')
        .select("*", { count: "exact" })
        .order('created_at', { ascending: false });

    // Ensure count is never undefined
    const finalCount = unseenConnectionsCount ?? 0;

    return (
        <div className=" pt-14 py-2 rounded-3xl fixed right-0 lg:w-2/3 w-screen h-screen bg-midnight">
            <div className="container px-2 top-2 bg-white rounded-xl lg:rounded-tl-none h-full border-l-2 drop-shadow-lg">
                <ConnectionRequests 
                    unseenConnections={unseenConnections} 
                    unseenConnectionsCount={finalCount} 
                    session={session}
                />
            </div>
        </div>
    );
}

export default ConnectionRequestsPage;
