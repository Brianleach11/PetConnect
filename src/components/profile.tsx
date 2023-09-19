'use client'
import React, { useEffect, useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import moment from 'moment'; 
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const Profile: React.FC = () => {
  const [userData, setUserData] = useState<Database['public']['Tables']['user']['Row'] | null>(null);
  const [petData, setPetData] = useState<Database['public']['Tables']['pet']['Row'] | null>(null);

  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    const fetchData = async () => {
      const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
      
      if (userId) {
        const { data: userData, error: userError } = await supabase
          .from('user')
          .select('*')
          .eq('id', userId)
          .single();

        if (userError) console.error('Error fetching user data:', userError);
        else setUserData(userData);

        const { data: petData, error: petError } = await supabase
          .from('pet')
          .select('*')
          .eq('owner_id', userId)
          .single();

        if (petError) console.error('Error fetching pet data:', petError);
        else setPetData(petData);
      }
    };
    
    fetchData();
  }, []);

  const calculateAge = (birthday: string | null) => {
    if (!birthday) return "Unknown";
    return moment().diff(moment(birthday), 'years');
  };

  return (
    <div className="w-[600px] mx-auto mt-8 space-y-4">
      <Tabs defaultValue="pet"> {/* Set defaultValue to "pet" */}
        <TabsList className="flex space-x-4">
          <TabsTrigger value="user" className="cursor-pointer">User</TabsTrigger>
          <TabsTrigger value="pet" className="cursor-pointer">Pet</TabsTrigger>
        </TabsList>

        <TabsContent value="user">
          <Card>
            <CardHeader className="bg-blue-500 text-white">
              <CardTitle className="text-lg">User Profile</CardTitle>
            </CardHeader>
            <CardContent>
              {userData ? (
                <div>
                  <p><strong>Username:</strong> {userData.username}</p>
                  <p><strong>Gender:</strong> {userData.gender}</p>
                  <p><strong>Birthday:</strong> {userData.birthday}</p>
                </div>
              ) : (
                <p>Loading...</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pet">
          <Card>
            <CardHeader className="bg-green-500 text-white">
              <CardTitle className="text-lg">Pet Profile</CardTitle>
            </CardHeader>
            <CardContent>
              {petData ? (
                <div>
                  <p><strong>Name:</strong> {petData.name}</p>
                  <p><strong>Type:</strong> {petData.pet_type}</p>
                  <p><strong>Breed:</strong> {petData.breed}</p>
                  <p><strong>Sex:</strong> {petData.sex}</p>
                  <p><strong>Birthday:</strong> {petData.birthday}</p>
                  <p><strong>Age:</strong> {calculateAge(petData.birthday)}</p>
                  <p><strong>Bio:</strong> {petData.bio}</p>
                </div>
              ) : (
                <p>Loading...</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
