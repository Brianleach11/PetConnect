'use client'
import React, { useEffect, useState, useRef  } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import moment from 'moment';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { useRouter } from 'next/navigation'; 
import { useToast } from '@/components/ui/use-toast'; 
import { Button } from '@/components/ui/button';
import * as Dialog from '@radix-ui/react-dialog';
import {X} from 'lucide-react'
import { Textarea } from '@/components/ui/textarea';  

const PetProfileDisplay: React.FC = () => {
  const [userData, setUserData] = useState<Database['public']['Tables']['user']['Row'] | null>(null);
  const [petData, setPetData] = useState<Database['public']['Tables']['pet']['Row'] | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [editedName, setEditedName] = useState<string | null>(null);
    const [editedType, setEditedType] = useState<string | null>(null);
    const [editedBreed, setEditedBreed] = useState<string | null>(null);
    const [editedBio, setEditedBio] = useState<string | null>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [uploadedDocuments, setUploadedDocuments] = useState<string[]>([]);
    const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  
  
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
    const userIdFromStorage = sessionStorage.getItem('clickedPetId');
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




const handleSaveChanges = async () => {
  try {
      if (!petData || !petData.id) {
          toast({
              title: 'Error',
              description: 'Missing pet data.',
              variant: 'destructive',
          });
          return;
      }

      // Update the pet data in the database
      const { data, error } = await supabase
          .from('pet')
          .update({
            name: editedName ?? petData.name,
            pet_type: editedType ?? petData.pet_type,
            breed: editedBreed ?? petData.breed,
            bio: editedBio ?? petData.bio,
        })      
          .eq('id', petData.id) 
          .select();

      // Check if there's an error
      if (error) {
          throw error;
      }

      // Update local state with new pet data
      setPetData(data[0]);

      toast({
          title: 'Success',
          description: 'Pet profile updated successfully.',
          variant: 'default',
      });

      setIsEditDialogOpen(false); // Close the dialog after saving

  } catch (error) {
      console.error('Error updating pet data:', error);
      toast({
          title: 'Error',
          description:'An error occurred while updating pet data.',
          variant: 'destructive',
      });
  }
};
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
 <Dialog.Root open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
  <Dialog.Trigger asChild>
    <Button className="px-5 py-2.5 rounded-md border border-softBlue hover:bg-softPink transition-colors duration-300">
      Edit Profile 🐾
    </Button>
  </Dialog.Trigger>

  <Dialog.Portal>
    <Dialog.Overlay className="fixed inset-0 bg-opacity-75 bg-darkGreen" />
    <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[90vh] w-[90vw] max-w-[500px] overflow-y-auto translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white p-[30px] shadow-xl border-t-8 border-softGreen">
      
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-softGreen"> Edit Pet Profile 🐾</h3>
        <Dialog.Close asChild>
          <button className="focus:outline-none">
            <X size={20} />
          </button>
        </Dialog.Close>
      </div>

      <div className="mt-8 space-y-4">
        
        {/* Pet Name */}
        <label htmlFor="editedName" className="block text-softBlue text-lg font-semibold mb-1">Name:</label>
        <input
          id="editedName"
          type="text"
          className="border-2 border-softBlue w-full rounded-md h-10 text-midnight px-3 py-2"
          defaultValue ={petData?.name || 'Pet Name' }
          onChange={(e) => setEditedName(e.target.value)}
        />
      
        {/* Pet Type */}
        <label htmlFor="editedType" className="block text-softBlue text-lg font-semibold mb-1">Type (e.g., Dog, Cat):</label>
        <input
          id="editedType"
          type="text"
          className="border-2 border-softBlue w-full rounded-md h-10 text-midnight px-3 py-2"
          defaultValue ={petData?.pet_type || 'Pet Type'}
          onChange={(e) => setEditedType(e.target.value)}
        />
      
        {/* Pet Breed */}
        <label htmlFor="editedBreed" className="block text-softBlue text-lg font-semibold mb-1">Breed:</label>
        <input
          id="editedBreed"
          type="text"
          className="border-2 border-softBlue w-full rounded-md h-10 text-midnight px-3 py-2"
          defaultValue ={petData?.breed || 'Pet Breed'}
          onChange={(e) => setEditedBreed(e.target.value)}
        />
      
        {/* Pet Bio */}
        <label htmlFor="editedBio" className="block text-softBlue text-lg font-semibold mb-1">Short Bio:</label>
        <textarea
          id="editedBio"
          rows={4}
          className="border-2 border-softBlue w-full rounded-md text-midnight px-3 py-2"
          defaultValue ={petData?.bio || 'Pet Bio' }
          onChange={(e) => setEditedBio(e.target.value)}
        />

        {/* we can expand the  comments to add additional attributes like profilePicture, microchip number, vaccinations, etc. if needed */}
      
      </div>

      <div className="mt-6 flex justify-end">
        <Button className="px-5 py-2 bg-softGreen text-white rounded-md hover:bg-lightblue transition-colors duration-300" onClick={handleSaveChanges}>
          Save Changes
        </Button>
      </div>

    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>

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

      {/* Medication Documents Section */}
      <div className="mb-4">
        <Card>
          <CardHeader>
            <h3 className="text-xl font-semibold">Medication Documents</h3>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap">
              <button
                onClick={() => console}
                className="px-5 py-2.5 rounded-md border border-midnight hover:bg-darkGreen transition-colors duration-300"
              >
                Upload Documents
              </button>
              <input
                ref={}
                type="file"
                multiple
                hidden
                onChange={e => handleFileUpload(e, 'documents')}
            />
              {/* Displaying Uploaded Documents */}
              {uploadedDocuments.map((docUrl, index) => (
                <div key={index}>
                  <a href={docUrl} target="_blank" rel="noopener noreferrer">
                    View Document {index + 1}
                  </a>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <hr className="my-4"/> {/* Horizontal line */}

      {/* Image Upload Section */}
      <div className="mb-4">
        <button
          onClick={() => imageInputRef.current?.click()}
          className="px-5 py-2.5 rounded-md border border-midnight hover:bg-darkGreen transition-colors duration-300"
        >
          Upload Image
        </button>
        <input
                ref={imageInputRef}
                type="file"
                multiple
                hidden
                onChange={e => handleFileUpload(e, 'images')}
            />
        {/* Displaying Uploaded Images */}
        <div className="flex justify-center">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {uploadedImages.map((imageUrl, index) => (
              <div key={index}>
                <img 
                  style={{ maxWidth: "300px", maxHeight: "300px" }}
                  className="w-full h-full object-cover border-2 border-pink-600 p-1" 
                  src={imageUrl}
                  alt={`Uploaded Image ${index}`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetProfileDisplay;
