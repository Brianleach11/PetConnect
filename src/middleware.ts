import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
    
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  const {data: {session}} = await supabase.auth.getSession()

  const pathname = req.nextUrl.pathname

  const protectedRoutes = ["/messages/"]

  const chatRoutes = ["/messages/chat/"]

  const isAccessingChatRoutes = chatRoutes.some((route)=>pathname.startsWith(route))

  if(!session){
    console.log("No session, middleware redirecting to login")
    return NextResponse.redirect(new URL('/login', req.url))
  }

  if(session && isAccessingChatRoutes){
    const sessionUserIsChatUser = pathname.includes(session.user.id)
    console.log(pathname)
    if(!sessionUserIsChatUser){
      console.log("User is not one of the chat members")
      return NextResponse.redirect(new URL('/', req.url))
    }
  }
  
  //either create or customize the current middleware and pass in the session.user.id
  //see if id maches one of the two chat parties

  return res
}

export const config = {
  matcher: ['/messages/chat/:path*'],
}