'use client'
import React, { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import moment from 'moment';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import OwnerPetCardList from '@/components/OwnerPetCardList';
import { Button } from '@/components/ui/button';

const Profile: React.FC = () => {
  const [userData, setUserData] = useState<Database['public']['Tables']['user']['Row'] | null>(null);
  const [petData, setPetData] = useState<Database['public']['Tables']['pet']['Row'] | null>(null);
  const supabase = createClientComponentClient<Database>();
  

  useEffect(() => {
    const fetchData = async () => {
        const response = await supabase.auth.getSession();

        if (response.data.session) {
            const userId = response.data.session.user.id;

            const { data: userData, error: userError } = await supabase.from('user').select('*').eq('id', userId).single();
            if (userError) console.error('Error fetching user data:', userError);
            else setUserData(userData);

            const { data: petData, error: petError } = await supabase.from('pet').select('*').eq('owner_id', userId).single();
            if (petError) console.error('Error fetching pet data:', petError);
            else setPetData(petData);
        }
    };

    fetchData();
}, [supabase]);

const handleEditProfileClick = () => {
  console.log("Edit Profile button clicked");
  // TODO: Implement redirection or modal opening for profile editing
}


return (
  <div className="bg-gray-100 bg-opacity-25 lg:w-8/12 lg:mx-auto mb-8 p-4 md:p-8">
    <header className="flex items-start md:items-center mb-8 ml-8 md:ml-16">
      <div className="flex-shrink-0= mr-10">
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

      <div className="flex mt-4  md:ml-4 gap-2.5">

      <Button 
            onClick={handleEditProfileClick} 
            className="rounded-md border border-midnight hover:bg-darkGreen transition-colors duration-300"
          >
            Edit Profile
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
            <p className="text-gray-600">{userData?.bio || 'This user has no bio.'}</p>
        </CardContent>
    </Card>  
</div>
    
    <hr className="my-4"/> {/* Horizontal line */}

      {/* My Pets title and paw print */}
      <div className="flex items-center justify-center mb-4">
        <span className="text-3xl mr-4">🐾</span>
        <h2 className="text-2xl font-semibold">My Pets</h2>
        <span className="text-2xl mr-4"> 🎖️</span>
      </div>

    <div className="flex justify-center">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
      <OwnerPetCardList userId={userData?.id || ''} />
      </div>
    </div>
  </div>
);

};

export default Profile;

