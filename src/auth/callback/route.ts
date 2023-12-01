import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import type { NextRequest } from 'next/server'
import type { Database } from '@/types/supabase'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = createRouteHandlerClient<Database>({ cookies })
    await supabase.auth.exchangeCodeForSession(code)

    const {data, error} = await supabase.from('user').select('username').single()

    if(!error && data?.username){
      return NextResponse.redirect('/')
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect('/userProfile')
}