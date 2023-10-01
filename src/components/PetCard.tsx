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
import { Trash2, Pencil } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';


const supabase = createClientComponentClient<Database>();


interface PetCardProps {
  pet: Database['public']['Tables']['pet']['Row'];
}

const PetCard: React.FC<PetCardProps> = ({ pet }) => {
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [isCardHovered, setIsCardHovered] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const [openDialog, setOpenDialog] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isDeleted, setIsDeleted] = useState(false);

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

const handleDelete = async (petId: string) => {
  try {
    const { data, error } = await supabase
      .from('pet')
      .delete()
      .eq('id', petId);

    if (error) throw error;


    toast({
      title: 'Success',
      description: 'Pet deleted successfully.',
      variant: 'default',
    });

    setIsDeleted(true);
    
  } catch (error) {
    toast({
      title: 'Error',
      description:'Error deleting pet.',
      variant: 'destructive',
    });
  }

};

if (isDeleted) {
  return null;
}

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
          {currentUserId !== pet.owner_id &&   (
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

{currentUserId == pet.owner_id && (
  <div className="absolute top-2 right-2 flex items-center space-x-4">
    <Pencil 
      className="w-6 h-6 cursor-pointer hover:text-gray-600 inline-block" 
      onClick={(event) => {
        event.stopPropagation(); // This will stop the event from propagating up to parent elements
      }} 
    />
    <Trash2 
      className="w-6 h-6 cursor-pointer hover:text-red-600 inline-block" 
      onClick={(event) => {
        event.stopPropagation(); 
        setOpenDialog(true);
      }}     />
  </div>
)}

        </CardFooter>
      </Card>
      
      <Dialog.Root open={openDialog} onOpenChange={(open) => setOpenDialog(open)}>
      <Dialog.Overlay className="fixed inset-0 bg-darkGreen bg-opacity-50 z-50" />
      <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-md shadow-lg z-50">
        <p className="mb-4">Are you sure you want to delete this pet?</p>
        <div className="flex justify-end space-x-4">
          <button
            className="px-4 py-2 bg-gray-300 border rounded-md hover:bg-red transition-colors duration-300"
            onClick={() => setOpenDialog(false)}
          >
            Cancel
          </button>
          <Dialog.Close asChild>
          <button
            className="px-4 py-2 bg-red-500  border rounded-md hover:bg-red transition-colors duration-300"
            onClick={() => handleDelete(pet.id.toString())}
          >
            Yes, Delete
          </button>
          </Dialog.Close>

        </div>
      </Dialog.Content>
    </Dialog.Root>
  </div>
);
 
};

export default PetCard;
