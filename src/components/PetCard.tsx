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
import { v4 as uuidv4 } from 'uuid';
import { chatHrefConstructor } from "@/lib/utils"

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
  const [colorDialogOpen, setColorDialogOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string>(''); // default color, or get it from 'pet' prop
  const [newChatId, setNewChatId] = useState<string>("")
  const [connectionSent, setConnectionSent] = useState(false);
  const [sentConnections, setSentConnections] = useState(new Set<string>());
  const [areFriends, setAreFriends] = useState(false);
  const [grabbingAvatar, setGrabbingAvatar] = useState<boolean>(false)
  const [avatar, setAvatar] = useState<string>("https://mylostpetalert.com/wp-content/themes/mlpa-child/images/nophoto.gif")


  useEffect(() => {
    const fetchCurrentUserId = async () => {
      const response = await supabase.auth.getSession();
      const userId = response?.data?.session?.user?.id || null;
      setCurrentUserId(userId);
    };

    fetchCurrentUserId();
  }, []);

  const handleColorChange = async () => {
    try {
      const { data, error } = await supabase
        .from('pet')
        .update({ color: selectedColor })
        .eq('id', pet.id).select().single();
      pet = data ?? pet;

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Color updated successfully.',
        variant: 'default',
      });


      setColorDialogOpen(false); // close the dialog

    } catch (error) {
      toast({
        title: 'Error',
        description: 'Error updating color.',
        variant: 'destructive',
      });
    }


  };

  useEffect(() => {
    const getAvatar = async () => {
      if (!pet || !pet.id) return
      if (grabbingAvatar) return
      setGrabbingAvatar(true)

      const response = await fetch(`/api/getPetAvatar?id=${pet.id}`)

      if (!response.ok) {
        return;
      }

      const images = await response.json();

      if (!images || !images.at(0)) {
        console.log('Invalid response format for pet photos:', images);
        return;
      }

      const baseUrl = process.env.NEXTCLOUD_PETAVATAR_URL
      const imageUrl = `${baseUrl}/${encodeURIComponent(pet.id)}/${encodeURIComponent(images.at(0).basename)}&x=1280&y=720&a=true`;

      setAvatar(imageUrl)
      setGrabbingAvatar(false)
    }
    getAvatar()
  }, [pet])

  useEffect(() => {

    router.refresh();

  }, [colorDialogOpen, router]);

  const calculateAge = (birthday: string | null): string => {
    if (birthday) {
      const birthdate = moment(birthday);
      const today = moment();
  
      const years = today.diff(birthdate, 'years');
      const months = today.subtract(years, 'years').diff(birthdate, 'months');
      const days = today.subtract(months, 'months').diff(birthdate, 'days');
  
      let ageString = '';
      if (years > 0) {
        // If age is more than a year, display years and months
        ageString += `${years} year${years > 1 ? 's' : ''} `;
        if (months > 0) {
          ageString += `and ${months} month${months > 1 ? 's' : ''}`;
        }
      } else if (months > 0) {
        // If age is less than a year but more than a month, display months and days
        ageString += `${months} month${months > 1 ? 's' : ''} `;
        if (days > 0) {
          ageString += `and ${days} day${days > 1 ? 's' : ''}`;
        }
      } else {
        // If age is less than a month, display only days
        ageString += `${days} day${days === 1 ? '' : 's'}`;
      }
  
      return ageString;
    }
    return 'Loading...';
  };
  
  

  const handleCardClick = async () => {
    if (isButtonHovered) return;

    if (pet.id && pet.owner_id) {
      sessionStorage.setItem('clickedPetId', pet.id.toString());
      sessionStorage.setItem('clickedOwnerId', pet.owner_id.toString());

      if (pet.owner_id != currentUserId) {
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
      } else {
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
        description: 'Error deleting pet.',
        variant: 'destructive',
      });
    }
  };

  if (isDeleted) {
    return null;
  }

  const colors = [
    { name: 'softGreen', code: '#bee0c9' },
    { name: 'darkGreen', code: '#7a9988' },
    { name: 'pastelYellow', code: '#f6f6cb' },
    { name: 'midnight', code: '#283c49' },
    { name: 'whiteGreen', code: '#eaf6eb' },
    { name: 'white', code: '#FFFFFF' },
    { name: 'red', code: '#E97451' },
    { name: 'lightblue', code: '#ADD8E6' },
    { name: 'black', code: '#000000' },
    { name: 'brownLight', code: '#A52A2A' },
    { name: 'brownChocolate', code: '#7B3F00' },
    { name: 'brownLiver', code: '#674C47' },
    { name: 'cream', code: '#F5F5DC' },
    { name: 'gray', code: '#808080' },
    { name: 'blue', code: '#0000FF' },
    { name: 'yellow', code: '#FFFF00' },
    { name: 'fawn', code: '#E5AA70' },
    { name: 'orange', code: '#FFA500' },
    { name: 'golden', code: '#FFD700' },
    { name: 'tan', code: '#D2B48C' },
    { name: 'merleBlue', code: '#777788' },
    { name: 'merleRed', code: '#AA7766' },
    { name: 'brindle', code: '#733d1a' },
    { name: 'one', code: '#fbf8cc' },
    { name: 'two', code: '#fde4cf' },
    { name: 'three', code: '#ffcfd2' },
    { name: 'four', code: '#f1c0e8' },
    { name: 'five', code: '#cfbaf0' },
    { name: 'six', code: '#a3c4f3' },
    { name: 'seven', code: '#90dbf4' },
    { name: 'eight', code: '#8eecf5' },
    { name: 'nine', code: '#98f5e1' },
    { name: 'ten', code: '#b9fbc0' },
  ];

  useEffect(() => {
    const checkConnection = async () => {
      if (currentUserId) {  // Ensure currentUserId is not null
        const { data } = await supabase
          .from('friend_requests')
          .select('receiving_user')
          .eq('sending_user', currentUserId);

        if (data && Array.isArray(data)) {
          const updatedConnections = new Set(data.map(entry => entry.receiving_user));
          setSentConnections(updatedConnections);
        }
      }
    };

    checkConnection();
  }, [currentUserId]);



  const sendConnection = async () => {
    if (!currentUserId || !pet.owner_id) {
      console.error("User ID or pet owner ID is null or undefined");
      return;
    }

    const { error } = await supabase
      .from('friend_requests')
      .insert({
        sending_user: currentUserId,
        receiving_user: pet.owner_id
      });

    if (error) {
      console.error("Error sending connection: ", error);
    } else {
      const updatedSet = new Set(sentConnections);
      updatedSet.add(pet.owner_id);
      setSentConnections(updatedSet);
      setConnectionSent(true);
      router.refresh();
    }


  };


  const removeConnection = async () => {
    if (!currentUserId || !pet.owner_id) {
      console.error("User ID or pet owner ID is null or undefined");
      return;
    }

    const { error } = await supabase
      .from('friend_requests')
      .delete()
      .eq('sending_user', currentUserId)
      .eq('receiving_user', pet.owner_id);

    if (error) {
      console.error("Error removing connection: ", error);
    } else {
      const updatedSet = new Set(sentConnections);
      updatedSet.delete(pet.owner_id);
      setSentConnections(updatedSet);
      setConnectionSent(false);
      router.refresh();
    }
  };


  const redirectUser = async () => {
    console.log("REDIRECT TRIGGERED")
    if (!currentUserId || !pet.owner_id) return null
    let chatId
    let { data: query, error: chatIdError } = await supabase
      .from('chats')
      .select('chat_id, sender_id, recipient_id')
    if (query && Array.isArray(query)) {
      for (const chatInfo of query) {
        if ((chatInfo.sender_id == pet.owner_id && chatInfo.recipient_id == currentUserId) ||
          (chatInfo.sender_id == currentUserId && chatInfo.recipient_id == pet.owner_id)) {
          chatId = chatInfo.chat_id
        }
      }
    }

    if (chatIdError) console.log(chatIdError)
    console.log("RETURNED CHAT ID" + chatId)

    if (!chatId) {
      const { data: enteredChat, error: newChatError } = await supabase
        .from('messages')
        .insert(
          {
            sender_id: currentUserId,
            recipient_id: pet.owner_id,
            message_content: "",
            chat_id: uuidv4()
          }
        )
        .select()
        .single()
      console.log(enteredChat)
      if (enteredChat && enteredChat.chat_id) {
        console.log("Im setting it!" + enteredChat.chat_id)
        setNewChatId(enteredChat.chat_id)
      }
    }
    else {
      setNewChatId(chatId)
      console.log("Chat ID already exists: " + chatId)
    }
    //new line to test
    router.refresh()
  }

  useEffect(() => {
    if (newChatId) {
      const href = `/messages/chat/${chatHrefConstructor(
        currentUserId,
        pet.owner_id,
        newChatId
      )}`
      setNewChatId('')
      router.push(href)
    }
  }, [newChatId])


  const checkFriendship = async () => {
    if (!pet.owner_id || !currentUserId) {
      console.error("Invalid IDs for checking friendship status");
      return;
    }

    const { data: sentFriendship, error: sentError } = await supabase
      .from('friends')
      .select('*')
      .eq('sending_user', currentUserId)
      .eq('receiving_user', pet.owner_id);

    if (sentError) {
      console.error("Error fetching friendship status for sent request:", sentError);
      return;
    }

    if (sentFriendship && sentFriendship.length > 0) {
      setAreFriends(true);
      return;
    }

    const { data: receivedFriendship, error: receivedError } = await supabase
      .from('friends')
      .select('*')
      .eq('sending_user', pet.owner_id)
      .eq('receiving_user', currentUserId);

    if (receivedError) {
      console.error("Error fetching friendship status for received request:", receivedError);
      return;
    }

    if (receivedFriendship && receivedFriendship.length > 0) {
      setAreFriends(true);
    }
  }




  useEffect(() => {
    checkFriendship();
  }, [currentUserId, pet.owner_id]);

  return (
    <div>

      <Card
        onClick={handleCardClick}
        className={`relative w-72 m-10 bg-half-gradient transform transition-transform duration-300 ease-in-out ${isCardHovered ? 'scale-105 shadow-2xl' : 'shadow-lg'} rounded-lg border border-gray-200`}
        style={{ backgroundColor: pet.color || selectedColor }}
        onMouseEnter={() => setIsCardHovered(true)}
        onMouseLeave={() => setIsCardHovered(false)}
      >
        <CardHeader className="absolute top-[-60px] left-1/2 transform -translate-x-1/2 z-10">
          <img
            src={avatar}
            alt="Pet Image"
            className="w-40 h-40 object-cover rounded-full"
            style={{ width: '100px', height: '100px' }}
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
              {
                areFriends || !pet.owner_id ? null : (
                  sentConnections.has(pet.owner_id) ? (
                    <Button
                      className="px-5 py-2.5 rounded-md transform hover:scale-105"
                      onClick={removeConnection}
                      onMouseEnter={() => setIsButtonHovered(true)}
                      onMouseLeave={() => setIsButtonHovered(false)}
                    >
                      Connection Sent
                    </Button>
                  ) : (
                    <Button
                      className="px-5 py-2.5 rounded-md transform hover:scale-105"
                      onClick={sendConnection}
                      onMouseEnter={() => setIsButtonHovered(true)}
                      onMouseLeave={() => setIsButtonHovered(false)}
                    >
                      Connect
                    </Button>
                  )
                )
              }

              <Button
                className="px-5 py-2.5 rounded-md transform hover:scale-105 "
                onClick={redirectUser}
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
                  event.stopPropagation();
                  setColorDialogOpen(true);
                }}
              />
              <Trash2
                className="w-6 h-6 cursor-pointer hover:text-red-600 inline-block"
                onClick={(event) => {
                  event.stopPropagation();
                  setOpenDialog(true);
                }}
              />
            </div>
          )}
        </CardFooter>
      </Card>

      <Dialog.Root open={colorDialogOpen} onOpenChange={setColorDialogOpen}>
        <Dialog.Overlay className="fixed inset-0 bg-darkGreen bg-opacity-50 z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-md shadow-lg z-50 max-w-xs w-full">
          <p className="mb-4 text-lg font-bold">Choose a color for your  pet card:</p>
          <div className="grid grid-cols-4 gap-2 mb-4">
            {colors.map((color) => (
              <button
                key={color.code}
                onClick={() => setSelectedColor(color.code)}
                className={`w-12 h-12 rounded-md shadow-inner border-2 ${selectedColor === color.code ? 'border-blue-500' : 'border-transparent'}`}
                style={{ backgroundColor: color.code }}
                aria-label={color.name}
              />
            ))}
          </div>


          <div className="flex justify-end space-x-4">
            <button
              className="px-4 py-2 bg-gray-300 border rounded-md hover:bg-gray-400 transition-colors duration-300"
              onClick={() => setColorDialogOpen(false)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-blue-500 text-black border rounded-md hover:bg-blue-600 transition-colors duration-300"
              onClick={() => {
                handleColorChange();
                setColorDialogOpen(false);
              }}
              disabled={!selectedColor}
            >
              Save
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Root>

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
                className="px-4 py-2 bg-red-500 border rounded-md hover:bg-red transition-colors duration-300"
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
