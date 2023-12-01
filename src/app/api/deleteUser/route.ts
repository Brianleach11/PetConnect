import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { createClient } from '@supabase/supabase-js';
import { NextApiRequest, NextApiResponse } from 'next';
import { cookies } from 'next/headers';


export async function POST(req: NextApiRequest, res: NextApiResponse) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const data = await (req as any).formData()

    const userId = data.get('userId') as string;
    if(!url || !serviceRoleKey || !userId) {
        console.log('no creds')
        return new Response(JSON.stringify('No credentials'), {status: 408})
    }

    const supabase = createClient(url, serviceRoleKey);
    const response = await supabase.auth.admin.deleteUser(userId)
    return new Response(JSON.stringify('Success'), {status: 200})
}