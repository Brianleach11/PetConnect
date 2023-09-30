'use client'
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Database } from '@/types/supabase';
import moment from 'moment';
import { useRouter } from 'next/navigation'; 
import { useToast } from '@/components/ui/use-toast'; 
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';


const supabase = createClientComponentClient<Database>();


interface PetCardProps {
  pet: Database['public']['Tables']['pet']['Row'];
}

const PetCard: React.FC<PetCardProps> = ({ pet }) => {
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [isCardHovered, setIsCardHovered] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchCurrentUserId = async () => {
      const response = await supabase.auth.getSession();
      const userId = response?.data?.session?.user?.id || null;
      setCurrentUserId(userId);
    };

    fetchCurrentUserId();
  }, []);

  const calculateAge = (birthday: string | null): string => {
    if (birthday) {
      const birthdate = moment(birthday);
      const today = moment();
      const age = today.diff(birthdate, 'years');
      return `${age} years`;
    }
    return 'Loading...';
  };

  const handleCardClick = async () => {
    if (isButtonHovered) return;

    if (pet.id && pet.owner_id) {
      sessionStorage.setItem('clickedUserId', pet.id.toString());
      sessionStorage.setItem('clickedOwnerId', pet.owner_id.toString());
      
      if(pet.owner_id != currentUserId){
        const { data, error } = await supabase
            .from('user')
            .select('username')
            .eq('id', pet.owner_id)
            .single();
  
        if (data && data.username) {
            router.push(`/profile/public/${data.username}/myPets`);
        } else if (error) {
            toast({
                title: 'Error',
                description: error.message || 'Unable to fetch username.',
                variant: 'destructive',
            });
        }
    }
    
    // If the current user id exists, navigate to the current user's profile
    else  {
        const { data, error } = await supabase
            .from('user')
            .select('username')
            .eq('id', pet.owner_id)
            .single();
  
        if (data && data.username) {
            router.push(`/profile/myPets`);
        } else if (error) {
            toast({
                title: 'Error',
                description: error.message || 'Unable to fetch username.',
                variant: 'destructive',
            });
        }
    }
  }
};

  return (
    <div>
      <Card
        onClick={handleCardClick}
        className={`relative w-72 m-10 bg-half-gradient transform transition-transform duration-300 ease-in-out ${isCardHovered ? 'scale-105 shadow-2xl' : 'shadow-lg'} rounded-lg border border-gray-200`}
        onMouseEnter={() => setIsCardHovered(true)}
        onMouseLeave={() => setIsCardHovered(false)}
      >
        <CardHeader className="absolute top-[-38px] left-1/2 transform -translate-x-1/2 z-10">
          <img
            src="https://images.unsplash.com/photo-1561948955-570b270e7c36?fit=crop&w=500&h=500"
            alt="Pet Image"
            className="w-38 mx-auto rounded-full"
          />
        </CardHeader>

        <CardContent className="pt-20 text-center font-sans">
          <CardTitle className="text-4xl text-gray-500 mb-2.5">
            {pet.name || 'Loading...'}
          </CardTitle>
          <CardDescription className="text-lg text-gray-700 mb-2.5">
            {`Type: ${pet.pet_type || 'Loading...'}`}
          </CardDescription>
          <CardDescription className="text-lg text-gray-700 mb-2.5">
            {`Breed: ${pet.breed || 'Loading...'}`}
          </CardDescription>
          <CardDescription className="text-lg text-gray-700 mb-2.5">
            {`Sex: ${pet.sex || 'Loading...'}`}
          </CardDescription>
          <CardDescription className="text-lg text-gray-700 mb-2.5">
            {`Birthday: ${pet.birthday ? moment(pet.birthday).format('MM-DD-YYYY') : 'Loading...'}`}
          </CardDescription>
          <CardDescription className="text-lg text-gray-700 mb-2.5">
            {`Age: ${calculateAge(pet.birthday)}`}
          </CardDescription>
        </CardContent>

        <CardFooter className="flex justify-center gap-2.5 my-2">
          {currentUserId !== pet.owner_id && (
            <>
              <Button
                className="px-5 py-2.5 rounded-md  transform hover:scale-105"
                onClick={() => console.log(`Connected with ${pet.name}`)}
                onMouseEnter={() => setIsButtonHovered(true)}
                onMouseLeave={() => setIsButtonHovered(false)}
              >
                Connect
              </Button>

              <Button
                className="px-5 py-2.5 rounded-md transform hover:scale-105 "
                onClick={() => console.log(`Message sent to ${pet.name}`)}
                onMouseEnter={() => setIsButtonHovered(true)}
                onMouseLeave={() => setIsButtonHovered(false)}
              >
                Message
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default PetCard;
