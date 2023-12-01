import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

import type { NextRequest } from 'next/server'
import { Database } from './types/supabase'

export async function middleware(req: NextRequest) {
    
  const res = NextResponse.next()
  const supabase = createMiddlewareClient<Database>({ req, res })
  const {data: {session}} = await supabase.auth.getSession()

  const pathname = req.nextUrl.pathname

  const chatRoutes = ["/messages/chat/"]
  const formRoutes = ["/userProfile", "/petProfile"]

  const isAccessingChatRoutes = chatRoutes.some((route)=>pathname.startsWith(route))
  const isAccessingFormRoutes = formRoutes.some((route)=> pathname.startsWith(route))

  if(!session){
    return NextResponse.redirect(new URL('/login', req.url))
  }

  if(session && isAccessingChatRoutes){
    const sessionUserIsChatUser = pathname.includes(session.user.id)
    if(!sessionUserIsChatUser){
      return NextResponse.redirect(new URL('/', req.url))
    }
  }
  else if(session && isAccessingFormRoutes){
    const {data} = await supabase.from('user').select('*').eq('id', session.user.id).single()
    if(data?.username) return NextResponse.redirect(new URL('/', req.url))
  }

  return res
}

export const config = {
  matcher: ['/messages/chat/:path*', '/userProfile', '/petProfile'],
}