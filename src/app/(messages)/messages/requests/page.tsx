import { redirect } from 'next/navigation';
import { FC } from 'react';
import supabaseServer from '@/components/supabaseServer';
import ConnectionRequests from '@/components/connections/ConnectionRequests';

const ConnectionRequestsPage: FC = async () => {
    const { data: { session }, error: sessionError } = await supabaseServer().auth.getSession();

    if (!session || sessionError) {
        redirect('/');
    }

    const { data: unseenConnections, count: unseenConnectionsCount } = await supabaseServer()
        .from('friend_requests')
        .select("*", { count: "exact" })
        .order('created_at', { ascending: false });

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
