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
  }, []);


  return (
    <div className="w-[1000px] mx-auto mt-100 space-y-4">
      {/* Pet Profile Card */}
      <Card className="white rounded-lg">
        <CardHeader className="bg-white text-black flex items-center justify-between p-4 rounded-t-lg">
          <div className="flex items-center">
            <Avatar>
              <AvatarImage src={petData?.picture || ''} />
            </Avatar>
            <h2 className="text-lg">{petData?.name || 'Pet Name'}</h2>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          {petData ? (
            <div>
              <p><strong>Type:</strong> {petData.pet_type}</p>
              <p><strong>Breed:</strong> {petData.breed}</p>
              <p><strong>Sex:</strong> {petData.sex}</p>
              <p><strong>Birthday:</strong> {petData.birthday}</p>
              <p><strong>Age:</strong> {petData.birthday}</p>
              <hr />
              <div className="mt-4">
                <h3 className="text-lg font-semibold">Bio:</h3>
                <p className="text-justify">{petData.bio}</p>
              </div>
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </CardContent>
      </Card>

      {/* User Profile Card */}
      <Card className="white rounded-lg">
        <CardHeader className="bg-white text-black p-4 rounded-t-lg">
          <h2 className="text-lg">User Profile</h2>
        </CardHeader>
        <CardContent className="p-4">
          {userData ? (
            <div>
              <p><strong>Username:</strong> {userData.username}</p>
              <p><strong>Gender:</strong> {userData.gender}</p>
              <p><strong>Birthday:</strong> {userData.birthday}</p>
              <p><strong>City:</strong> {userData.city}</p>
              <p><strong>State:</strong> {userData.state}</p>
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </CardContent>
      </Card>
      
      <Card className="white rounded-lg">
        <CardHeader className="bg-white text-black flex items-center justify-between p-4 rounded-t-lg">
          <div className="flex items-center">
            <h2 className="text-lg">Medication and Vaccination</h2>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
};

export default Profile;

