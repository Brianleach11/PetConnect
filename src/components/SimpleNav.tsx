'use client'
import {FC, useEffect} from 'react'
import { Session, createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import Image from "next/image";
import { buttonVariants } from "./ui/button";
import {useRouter} from 'next/navigation'
import ProfileDropdown from "./ProfileDropdown";
import { Database } from '@/types/supabase';

interface SimleNavProps {
    session: Session | null,
    authToken: boolean
}

const SimpleNav: FC<SimleNavProps> = ({session, authToken}) =>{
    const router = useRouter()
    const supabase = createClientComponentClient<Database>()

    useEffect(()=>{
        const findSession = async() =>{
            const valid = await supabase.auth.getSession()
            if(valid)
            {
                router.refresh()
            }
        }

        if(authToken){
            findSession()
        }
    }, [authToken])
    
    return(
        <div className='fixed top-0 inset-x-0 h-fit z-[10] py-2'>
                <div className='container max-w-7xl h-full mx-auto flex items-center justify-between gap-2'>
                <Link href='/' className='flex gap-2 items-center'>
                    <Image src="/assets/logo.png" priority width={75} height={75} alt="Logo"/>
                    <p className='hidden text-zinc-700 text-3xl font-large font-bold md:block'>Pet Connect</p>
                </Link>
                {session ? <ProfileDropdown/> : <Link href="/login" className={buttonVariants()}>Sign In</Link>}
            </div>
        </div>
    )
}

export default SimpleNav