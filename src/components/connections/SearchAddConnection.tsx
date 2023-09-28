'use client'
import {FC, useState } from 'react'
import { Textarea } from '../ui/textarea'
import { Button, buttonVariants } from '../ui/button';
import { createClientComponentClient, Session } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import { useToast } from '../ui/use-toast';
import { useRouter } from 'next/navigation';

interface SeaerchAddConnectionProps {
    session: Session
}

const SearchAddConnection: FC<SeaerchAddConnectionProps> = ({session}) => {
    const [username, setUsername] = useState<string>("");
    const supabase = createClientComponentClient<Database>()
    const {toast} = useToast()
    const router = useRouter()

    const handleSearch = async() => {
        if(username){
            const{data: user, error: noUser} = await supabase
            .from('user')
            .select('id')
            .ilike('username', `%${username}%`)
            .single()

            if(!user || noUser){
                toast({
                    title: "Error",
                    description: "User not found, try again",
                    variant: 'destructive',
                })
                return
            }

            const{data: exists, error: alreadyExists} = await supabase
                .from('friend_requests')
                .select('id')
                .or(`sending_user.eq.${session.user.id}, receiving_user.eq.${user.id}`)
                .single()

            if(exists){
                console.log(exists)
                toast({
                    title: "Error",
                    description: `A request already exists for: ${username}`,
                    variant: 'destructive',
                })
                return
            }

            const {error} = await supabase  
                .from('friend_requests')
                .insert(
                    {sending_user: session.user.id, receiving_user: user.id}
                )

            if(error){
                toast({
                    title: "Error",
                    description: `Failed to add user: ${username}`,
                    variant: 'destructive',
                })
                return
            }
            else{
                toast({
                    title: "Success",
                    description: `Connection Request Sent!`,
                    variant: 'default',
                })
                router.refresh()
            }
        }
    }
    return(
        <div className='flex flex-row w-full'>
            <div className="flex-grow">
                <input
                type="text"
                className="border-2 border-midnight border-opacity-100 w-3/4 rounded-sm h-full text-midnight"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            <div className="">
                <Button className={buttonVariants({variant: 'default'})} onClick={() => handleSearch()}>
                    Add
                </Button>
            </div>
        </div>
    )
}

export default SearchAddConnection