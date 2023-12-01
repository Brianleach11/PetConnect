'use client'
import React, { FC, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/supabase'
import { ChevronLeft } from 'lucide-react'

interface ClickUsernameProps {
    chatPartnerUsername: string,
    chatPartner: string
}

const ClickUsername: FC<ClickUsernameProps> =({chatPartnerUsername, chatPartner})=> {
    const router = useRouter()
    const [avatar, setAvatarUrl] = useState<string>("")

    const supabase = createClientComponentClient<Database>()

    const handleRedirect = () => {
        sessionStorage.setItem('clickedUserId', chatPartner)
        router.push(`/profile/public/${chatPartnerUsername}`)
    }

    useEffect(() => {
        if (chatPartner) fetchAvatar(chatPartner);
    }, []);

    const fetchAvatar = async (userId: string) => {
        try {
            const { data } = await supabase
                .from('user')
                .select('defaultAvatar')
                .eq('id', userId)
                .select()
                .single();
            if (data?.defaultAvatar) {
                setAvatarUrl(data?.defaultAvatar)
                return;
            }

            const response = await fetch(`/api/getUserAvatar?userId=${userId}`);
            if (!response.ok) throw new Error('Failed to fetch avatar');

            const images = await response.json();
            if (!images || !images.at(0)) throw new Error('No avatar image found');

            const baseUrl = process.env.NEXTCLOUD_USERAVATAR_URL; // Adjust this to your environment
            const imageUrl = `${baseUrl}/${encodeURIComponent(userId)}/${encodeURIComponent(images.at(0).basename)}&x=1280&y=720&a=true`;

            setAvatarUrl(imageUrl);
        } catch (error) {
            console.error('Error fetching avatar:', error);
            // Set the specified image as the default avatar
            setAvatarUrl('https://i.pinimg.com/564x/67/81/e2/6781e2acffe6af95cd30a705714ed653.jpg');
        }
    };
    
    return (
        <div className="flex space-x-3 items-center">
            <button onClick={() => router.push('/messages')} className='absolute top-2 left-0 rounded-sm hover:bg-softGreen'>
                <ChevronLeft />
            </button>
            <img
                src={avatar}
                alt="Avatar"
                loading = "eager"
                className="w-10 h-10 rounded-full object-cover"
                style={{ transform: 'translateY(-5px)' }} // Adjust the value as needed
            />
            <button className='text-gray-700 mr-3 font-medium hover:underline' onClick={handleRedirect}>
                {chatPartnerUsername}
            </button>
        </div>
        
    )
}

export default ClickUsername