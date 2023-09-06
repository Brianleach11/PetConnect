'use client'
import Link from "next/link";
import Image from "next/image";
import { Button, buttonVariants } from "./ui/button";
import { Session, createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import {useRouter} from 'next/navigation'


export default function NavBar({session}: {session: Session | null}) {

  const supabase = createClientComponentClient()
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      router.replace('/')
    } catch (error) {
      console.error(error);
      alert("Error logging out. Check console for details.");
    }
  };
//{session ? <Button onClick={handleSignOut}>Sign Out</Button> : <Link href="/login" className={buttonVariants()}>Sign In</Link>}
  return (
    <>
      <div className='fixed top-0 inset-x-0 h-fit bg-softGreen border-b border-zinc-300 z-[10] py-2'>
        <div className='container max-w-7xl h-full mx-auto flex items-center justify-between gap-2'>
          <Link href='/' className='flex gap-2 items-center'>
            <Image src="/assets/logo.png" width={75} height={75} alt="Logo"/>
            <p className='hidden text-zinc-700 text-3xl font-large font-bold md:block'>Pet Connect</p>
          </Link>
          <Link href="/pets" className={buttonVariants({variant: "ghost"})}>Pets</Link>
          <Link href="/maps" className={buttonVariants({variant: "ghost"})}>Maps</Link>
          <Link href="/mesages" className={buttonVariants({variant: "ghost"})}>Messages</Link>
          {session ? <Button onClick={handleSignOut}>Sign Out</Button> : <Link href="/login" className={buttonVariants()}>Sign In</Link>}
        </div>
      </div>
    </>
  );
};