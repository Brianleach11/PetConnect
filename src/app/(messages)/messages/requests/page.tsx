import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import {FC} from 'react'
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Database } from '@/types/supabase';
import ConnectionRequests from '@/components/connections/ConnectionRequests';


const page = async() => {
  const supabase = createServerComponentClient<Database>({cookies})
  const {data: {session}, error: sessionError} = await supabase.auth.getSession()

  if(!session || sessionError) redirect('/')

  let {data: unseenConnections, count: unseenConnectionsCount, error: unseenConnectionsError} = await supabase
        .from('friend_requests')
        .select("*", {count: "exact"})
        .order('created_at', {ascending: false})

  if(!unseenConnectionsCount) unseenConnectionsCount = 0;

  return (
    <div className="px-4 py-2 rounded-3xl fixed right-0 w-2/3 h-screen bg-midnight">
      <div className="container px-2 top-2 bg-white rounded-xl h-full">
        <ConnectionRequests 
          unseenConnections={unseenConnections} 
          unseenConnectionsCount={unseenConnectionsCount} 
          session={session}
        />
      </div>
    </div>
  )
}

export default page