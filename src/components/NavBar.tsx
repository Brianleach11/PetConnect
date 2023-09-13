'use client'
import Link from "next/link";
import Image from "next/image";
import { Button, buttonVariants } from "./ui/button";
import { Session, createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import {useRouter} from 'next/navigation'
import { useEffect } from "react";
import ProfileDropdown from "./ProfileDropdown";
//initial session, null. Until manual refresh when session isnt null


export default function NavBar({session, authToken}: {session: Session | null, authToken: boolean}) {

  const supabase = createClientComponentClient()
  const router = useRouter()

  useEffect(()=>{
    if(authToken){
      router.refresh()
    }
  })
//{session ? <Button onClick={handleSignOut}>Sign Out</Button> : <Link href="/login" className={buttonVariants()}>Sign In</Link>}
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
          <Link href={session ? "/chat": {}} className={buttonVariants({variant: "ghost"})}>Messages</Link>
          {session ? <ProfileDropdown/> : <Link href="/login" className={buttonVariants()}>Sign In</Link>}
        </div>
      </div>
    </>
  );
};