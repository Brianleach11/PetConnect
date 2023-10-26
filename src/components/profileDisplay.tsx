'use client'
import React, { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import moment from 'moment';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { useRouter } from 'next/navigation'; 
import { useToast } from '@/components/ui/use-toast'; 
import { Button } from '@/components/ui/button';

const ProfileDisplay: React.FC = () => {
  const [userData, setUserData] = useState<Database['public']['Tables']['user']['Row'] | null>(null);
  const [petData, setPetData] = useState<Database['public']['Tables']['pet']['Row'] | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    const userIdFromStorage = localStorage.getItem('clickedUserId');
    setUserId(userIdFromStorage);
    
    const fetchData = async () => {
      if (userIdFromStorage) {
        const { data: userData, error: userError } = await supabase.from('user').select('*').eq('id', userIdFromStorage).single();
        if (userError) console.error('Error fetching user data:', userError);
        else setUserData(userData);

        const { data: petData, error: petError } = await supabase.from('pet').select('*').eq('owner_id', userIdFromStorage).single();
        if (petError) console.error('Error fetching pet data:', petError);
        else setPetData(petData);
      }
    };

    fetchData();
  }, []);

  const handleConnectClick = () => {
    console.log("Connect button clicked");  // Add your desired functionality here
  }

  const handleMessageClick = () => {
    console.log("Message button clicked");  // Add your desired functionality here
  }

  return (
    <div className="bg-gray-100 bg-opacity-25 lg:w-8/12 lg:mx-auto mb-8 p-4 md:p-8">
      <header className="flex items-start md:items-center mb-8 ml-8 md:ml-16">
        <div className="flex-shrink-0 mr-10">
          <img 
            className="w-20 h-20 md:w-40 md:h-40 object-cover rounded-full border-2 border-pink-600 p-1" 
            src="https://images.unsplash.com/photo-1561948955-570b270e7c36?fit=crop&w=500&h=500" 
            alt="Dog Image" 
            width={160} 
            height={160} 
          />
        </div>
        <div>
          <h2 className="text-2xl font-light mb-3">
            {userData?.username || 'Username'}
            </h2>
        <h1 className="text-2xl font-semibold mb-1">
    My name is {petData?.name || 'Pet Name'} :)
    </h1>
    <span className="text-l">I am a {petData?.pet_type}, My breed is {petData?.breed}</span>
    <p className="text-l">I was born on {`${petData?.birthday}`}</p>
    <p className="text-l">{userData?.city}, {userData?.state}</p>
        </div>
        <div className="flex  mt-4 md:mt-0 md:ml-4 gap-2.5">
          <Button 
            onClick={handleConnectClick} 
            className="px-5 py-2.5 rounded-md border border-midnight hover:bg-darkGreen transition-colors duration-300"
          >
            Connect
          </Button>
          <Button 
            onClick={handleMessageClick} 
            className="px-5 py-2.5 rounded-md border border-midnight hover:bg-darkGreen transition-colors duration-300"
          >
            Message
          </Button>
        </div>
      </header>

 {/* Bio Card */}
<div className="mb-4">
    <Card className="bg-transparent">
        <CardHeader className="bg-transparent">
            <h3 className="text-xl font-semibold">Bio</h3>
        </CardHeader>
        <CardContent className="bg-transparent">
            <p className="text-gray-600">{petData?.bio || 'This user has no bio.'}</p>
        </CardContent>
    </Card>  
</div>

      {/* Medication Documents */}
      <div className="mb-4">
        <Card>
          <CardHeader>
            <h3 className="text-xl font-semibold">Medication Documents</h3>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap">
              {/* Expected Document components go here */}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <hr className="my-4"/> {/* Horizontal line */}

      <div className="flex justify-center">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {/* The code for displaying user posts with images */}
          {[...Array(6)].map((_, index) => (
            <div key={index}>
              <img 
                style={{ maxWidth: "300px", maxHeight: "300px" }}
                className="w-full h-full object-cover border-2 border-pink-600 p-1" 
                src="https://images.unsplash.com/photo-1561948955-570b270e7c36?fit=crop&w=500&h=500" 
                alt="Dog Image" 
              />
            </div>
          ))}
        </div>
      </div>
    </div>
);

};

export default ProfileDisplay;
