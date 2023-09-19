'use client'
import React, { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import moment from 'moment';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import Image from "next/image";


const Profile: React.FC = () => {
  const [userData, setUserData] = useState<Database['public']['Tables']['user']['Row'] | null>(null);
  const [petData, setPetData] = useState<Database['public']['Tables']['pet']['Row'][] | null>(null);

  const supabase = createClientComponentClient<Database>();
  useEffect(() => {
    const fetchData = async () => {
      const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
      if (userId) {
        const { data: userData, error: userError } = await supabase.from('user').select('*').eq('id', userId).single();
        if (userError) console.error('Error fetching user data:', userError);
        else setUserData(userData);

        const { data: petData, error: petError } = await supabase.from('pet').select('*').eq('id', userId);
        if (petError) console.error('Error fetching pet data:', petError);
        else setPetData(petData);
      }
    };

    fetchData();
  }, []);


  return (
    <div className="w-[1000px] mx-auto mt-100 space-y-4">
      {/* Pet Profile Card */}
      {petData?.map((pet, index) => (
        <Card key={index} className="white rounded-lg">
          <CardHeader className="bg-white text-black flex items-center justify-between p-4 rounded-t-lg">
            <div className="flex items-center">
              <Avatar>
                <AvatarImage src="/assets/logo.png" alt="Logo" />
              </Avatar>
              <h2 className="text-lg">{pet.name || 'Pet Name'}</h2>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div>
              <p><strong>Type:</strong> {pet.pet_type}</p>
              <p><strong>Breed:</strong> {pet.breed}</p>
              <p><strong>Sex:</strong> {pet.sex}</p>
              <p><strong>Birthday:</strong> {pet.birthday}</p>
              <p><strong>Age:</strong> {pet.birthday}</p>
              <hr />
              <div className="mt-4">
                <h3 className="text-lg font-semibold">Bio:</h3>
                <p className="text-justify">{pet.bio}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

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
              <p><strong>I am looking for:</strong> {userData.looking_for}</p>
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