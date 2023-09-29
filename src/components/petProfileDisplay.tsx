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

const PetProfileDisplay: React.FC = () => {
  const [userData, setUserData] = useState<Database['public']['Tables']['user']['Row'] | null>(null);
  const [petData, setPetData] = useState<Database['public']['Tables']['pet']['Row'] | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const router = useRouter();
  const supabase = createClientComponentClient<Database>();
  const { toast } = useToast();

  useEffect(() => {
    const fetchCurrentUserId = async () => {
      const response = await supabase.auth.getSession();
      const userId = response.data.session?.user.id || null;
      setCurrentUserId(userId);
    };

    fetchCurrentUserId();
  }, []);

  useEffect(() => {
    const userIdFromStorage = sessionStorage.getItem('clickedUserId');
    const ownerIdFromStorage = sessionStorage.getItem('clickedOwnerId');
    setUserId(userIdFromStorage);
    const fetchData = async () => {
      if (userIdFromStorage && ownerIdFromStorage) {
        const { data: userData, error: userError } = await supabase.from('user').select('*').eq('id', ownerIdFromStorage).single();
        if (userError) console.error('Error fetching user data:', userError);
        else setUserData(userData);
        const { data: petData, error: petError } = await supabase.from('pet').select('*').eq('id', userIdFromStorage).single();
        if (petError) console.error('Error fetching pet data:', petError);
        else setPetData(petData);
      }
    };
    fetchData();
  }, []);

  const handleConnectClick = () => {
    console.log("Connect button clicked"); 
  }

  const handleMessageClick = () => {
    console.log("Message button clicked");  
  }

  const handleEditProfileClick = () => {
    console.log("Edit Profile button clicked");
    // Redirect or open the edit profile page/modal
  }

  const handleClick = async() => {
    if (userData?.id && petData?.owner_id && currentUserId) {
      sessionStorage.setItem('clickedUserId', userData.id.toString());
      sessionStorage.setItem('clickedOwnerId', petData.owner_id.toString());

      if(userData?.id != currentUserId){
      const { data, error } = await supabase
        .from('user')
        .select('username')
        .eq('id', petData.owner_id)
        .single();

      if (data && data.username) {
        router.push(`/profile/public/${userData.username}`);
      } else if (error) {
        toast({
          title: 'Error',
          description: error.message || 'Unable to fetch username.',
          variant: 'destructive',
        });
      }
    }

    else{
      const { data, error } = await supabase
        .from('user')
        .select('username')
        .eq('id', currentUserId)
        .single();

      if (data && data.username) {
        router.push(`/profile`);
      } else if (error) {
        toast({
          title: 'Error',
          description: error.message || 'Unable to fetch username.',
          variant: 'destructive',
        });
      }
    }
    } else {
      toast({
        title: 'Error',
        description: 'Missing user ID.',
        variant: 'destructive',
      });
    }

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
            <a 
              onClick={handleClick} 
              className="text-blue-600 hover:text-blue-800 cursor-pointer hover:underline"  // Styling changes added here
            >
              {userData?.username || 'Loading.........'}
            </a>
          </h2>
        <h1 className="text-2xl font-semibold mb-1">
    My name is {petData?.name || 'Pet Name'} :)
    </h1>
<span className="text-l">I am a {petData?.pet_type ||'Loading.........'} , My breed is {petData?.breed || 'Loading.........'}</span>
<p className="text-l">I was born on {`${petData?.birthday || 'Loading.........'}`}</p>
<p className="text-l">{userData?.city || 'Loading.........'}, {userData?.state || 'Loading.........'}</p>
<div>
        {currentUserId !== userData?.id ? (
          <div className="flex mt-4  md:ml-4 gap-2.5">
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
        ) : (
          <div className="mt-4 md:ml-10">
            <Button 
              onClick={handleEditProfileClick} 
              className="px-5 py-2.5 rounded-md border border-midnight hover:bg-darkGreen transition-colors duration-300"
            >
              Edit Profile
            </Button>
          </div>
        )}
      </div>
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

export default PetProfileDisplay;
