'use client'
import React, { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import moment from 'moment';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage } from '@/components/ui/avatar';

const Profile: React.FC = () => {
  const [userData, setUserData] = useState<Database['public']['Tables']['user']['Row'] | null>(null);
  const [petData, setPetData] = useState<Database['public']['Tables']['pet']['Row'] | null>(null);

  const supabase = createClientComponentClient<Database>();
  useEffect(() => {
    const fetchData = async () => {
      const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
      if (userId) {
        const { data: userData, error: userError } = await supabase.from('user').select('*').eq('id', userId).single();
        if (userError) console.error('Error fetching user data:', userError);
        else setUserData(userData);

        const { data: petData, error: petError } = await supabase.from('pet').select('*').eq('owner_id', userId).single();
        if (petError) console.error('Error fetching pet data:', petError);
        else setPetData(petData);
      }
    };

    fetchData();
  }, );


  return (
    <div className="bg-gray-100 bg-opacity-25 lg:w-8/12 lg:mx-auto mb-8">
      <header className="flex flex-wrap items-center p-4 md:py-8">
        <div className="md:w-3/12 md:ml-16">
        <img 
          className="w-20 h-20 md:w-40 md:h-40 object-cover rounded-full border-2 border-pink-600 p-1" 
          src="https://images.unsplash.com/photo-1561948955-570b270e7c36?fit=crop&w=500&h=500" 
          alt="Dog Image" 
          width={160} 
         height={160} 
     />
        </div>
        <div className="w-8/12 md:w-7/12 ml-4">
          <div className="md:flex md:flex-wrap md:items-center mb-4">
            <h2 className="text-3xl inline-block font-light md:mr-2 mb-2 sm:mb-0">
              {userData?.username || 'Username'}
            </h2>
          </div>
          <div className="hidden md:block">
            <h1 className="font-semibold">My name is {petData?.name || 'Pet Name'} :)</h1>
            <span>Iam a {petData?.pet_type}, My breed is {petData?.breed}</span>
            <p>I was born on {`${petData?.birthday}`}</p>
            <p> {userData?.city}, {userData?.state}`</p>
          </div>
        </div>
      </header>
      <div className="px-px md:px-3 mt-4">
        <Card>
          <CardHeader>
            <h3 className="text-xl font-semibold">Bio</h3>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">{petData?.bio || 'This user has no bio.'}</p>
          </CardContent>
        </Card>  
      </div>
      <div className="px-px md:px-3 mt-4">
        {/* Attachments Section */}
        <Card>
          <CardHeader>
            <h3 className="text-xl font-semibold">Medication Documents </h3>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap">
              
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="px-px md:px-3 mt-4">
        <hr className="my-4"/> {/* Horizontal line */}
        <div className="flex flex-wrap -mx-px md:-mx-3">
          {/* The code for displaying user posts with images */}
          {[...Array(6)].map((_, index) => (
            <div className="w-1/2 md:w-1/3 p-px md:p-3 flex justify-center items-center" key={index}>
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

export default Profile;

