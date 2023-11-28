'use client'
import React, { useEffect, useState, useRef } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import moment from 'moment';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import * as Dialog from '@radix-ui/react-dialog';
import { X, Upload, FilePlus2, Pencil, Delete, Trash2 } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea';
import MedicalDocCard from './medicalDocuments/medicalDocCard';
import ImageComponent from './ImageComonent';
import Image from 'next/image';
import { createClient } from 'webdav';

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
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const documentInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [grabbingPhotos, setGrabbingPhotos] = useState<boolean>(false);
  const [grabbingAvatar, setGrabbingAvatar] = useState<boolean>(false);
  const petAvatarRef = useRef<HTMLInputElement>(null);
  const [avatar, setAvatar] = useState<string>("https://mylostpetalert.com/wp-content/themes/mlpa-child/images/nophoto.gif")
  const [editPhotos, setEditPhotos] = useState<boolean>(false)

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
  }

  useEffect(() => {
    const handlePhotos = async () => {
      try {
        if (!petData || !petData.id) return
        if (grabbingPhotos) return
        setGrabbingPhotos(true)

        const response = await fetch(`/api/getPetPhotos?petId=${petData?.id}`);

        if (!response.ok) {
          console.error('Failed to fetch pet avatar:', response.statusText);
          return;
        }

        const images = await response.json();

        if (!images || !Array.isArray(images)) {
          console.error('Invalid response format for pet avatar:', images);
          return;
        }

        const baseUrl = process.env.NEXTCLOUD_PETALBUM_URL
        const imageUrls = images.map(image =>
          `${baseUrl}/${encodeURIComponent(petData.id)}/${encodeURIComponent(image.basename)}&x=1280&y=720&a=true`
        );
        setUploadedImages(imageUrls);
        setGrabbingPhotos(false)
      } catch (error) {
        console.error('Error fetching pet photos:', error);
      }
    };

    handlePhotos();
  }, [petData]);

  useEffect(() => {
    const handleAvatar = async () => {
      try {
        if (!petData || !petData.id) return;
        if (grabbingAvatar) return;
        setGrabbingAvatar(true)

        const response = await fetch(`/api/getPetAvatar?petId=${petData?.id}`);

        if (!response.ok) {
          console.error('Failed to fetch pet photos:', response.statusText);
          return;
        }

        const images = await response.json();

        if (!images || !images.at(0)) {
          console.error('Invalid response format for pet photos:', images);
          return;
        }

        const baseUrl = process.env.NEXTCLOUD_PETAVATAR_URL
        const imageUrl = `${baseUrl}/${encodeURIComponent(petData.id)}/${encodeURIComponent(images.at(0).basename)}&x=1280&y=720&a=true`;

        setAvatar(imageUrl)
        setGrabbingAvatar(false)
      } catch (error) {
        console.log(error)
      }
    }
    handleAvatar()
  }, [petData])


  const handleClick = async () => {
    if (userData?.id && petData?.owner_id && currentUserId) {
      sessionStorage.setItem('clickedUserId', userData.id.toString());
      sessionStorage.setItem('clickedOwnerId', petData.owner_id.toString());

      if (userData?.id != currentUserId) {
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

      else {
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


  const handleFileUpload = async (event: any, folder: string) => {
    const file = event?.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    if (!petData || !petData.id) return;
    formData.append('petId', petData.id.toString())
    formData.append('folder', folder)

    try {
      toast({
        title: "Uploading...",
        description: "File attempting to upload",
        variant: "default",
      })
      const response = await fetch(`/api/uploadDocuments`, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "File upload success",
          variant: "default"
        })
        router.refresh()
      } else {
        throw new Error('File upload failed');
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const avatarUpload = async (event: any, folder: string) => {
    const file = event?.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    if (!petData || !petData.id) return;
    formData.append('id', petData.id.toString())
    formData.append('folder', folder)

    try {
      toast({
        title: "Uploading...",
        description: "File attempting to upload",
        variant: "default"
      })

      const response = await fetch(`/api/uploadAvatar`, {
        method: 'POST',
        body: formData
      });
    } catch (error) {
      console.log("ERROR IN AVATAR UPLOAD")
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
        description: 'An error occurred while updating pet data.',
        variant: 'destructive',
      });
    }
  };

  const formatBirthday = () => {
    const rawBirthday = petData?.birthday;

    if (rawBirthday) {
      // Assuming rawBirthday is in the format "YYYY-MM-DD"
      const parsedDate = new Date(rawBirthday);

      // Format the date into a more readable format
      const formattedDate = parsedDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      petData.birthday = formattedDate;
    }
  }

  const handleDeletePhotos = async (index: number) => {
    await fetch(`/api/deletePetPhoto?filename=${uploadedImages[index]}`)
    router.refresh()
  }

  useEffect(() => {
    if (petData) formatBirthday()
  }, [petData])

  return (
    <div className="bg-whiteGreen border-r-2 border-r-grey border-l-2 border-l-grey bg-opacity-25 lg:w-8/12 lg:mx-auto mb-8 p-4 md:p-8">
      <header className="flex items-start md:items-center mb-8 ml-8 md:ml-16">
        <div className="flex-shrink-0 mr-10">
          <img
            className="w-20 h-20 md:w-40 md:h-40 object-cover rounded-full border-2 border-pink-600 p-1"
            src={avatar}
            alt="Dog Image"
            width={160}
            height={160}
          />
        </div>
        {currentUserId === userData?.id && (
          <button
            onClick={() => petAvatarRef.current?.click()}
            className="absolute flex items-center justify-center rounded-md border border-midnight hover:bg-darkGreen transition-colors duration-300"
            style={{ transform: 'translate(500%, 200%)' }}
          >
            <Pencil />
          </button>
        )}
        <input
          ref={petAvatarRef}
          type="file"
          multiple
          hidden
          onChange={(e) => avatarUpload(e, 'PetAvatar')}
        />
        <div>
          <h2 className="text-2xl font-light mb-3">
            <a
              onClick={handleClick}
              className="text-blue-600 hover:text-blue-800 cursor-pointer hover:underline"
            >
              {userData?.username || 'Loading...'}
            </a>
          </h2>
          <h1 className="text-2xl font-semibold mb-1">
            My name is {petData?.name || 'Pet Name'}
          </h1>
          <span className="text-l font-bold">I am a(n) {petData?.breed || ''}</span>
          <p className="text-l">I was born on {`${petData?.birthday || ''}`}</p>
          <p className="text-l">{userData?.city || ''}, {userData?.state || ''}</p>
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
                  </Dialog.Trigger>
                  <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-opacity-75 bg-darkGreen" />
                    <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[90vh] w-[90vw] max-w-[500px] overflow-y-auto translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white p-[30px] shadow-xl border-t-8 border-softGreen">
                      <div className="flex justify-between items-center">
                        <h3 className="text-xl font-semibold text-softGreen">  Edit Bio </h3>
                        <Dialog.Close asChild>
                          <button className="focus:outline-none">
                            <X size={20} />
                          </button>
                        </Dialog.Close>
                      </div>
                      <div className="mt-8 space-y-4">

                        {/* Pet Bio */}
                        <label htmlFor="editedBio" className="block text-softBlue text-lg font-semibold mb-1">Short Bio:</label>
                        <textarea
                          id="editedBio"
                          rows={4}
                          className="border-2 border-softBlue w-full rounded-md text-midnight px-3 py-2"
                          defaultValue={petData?.bio || 'Pet Bio'}
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
      <div className="mb-4 relative">
        <Card>
          <CardHeader>
            <h3 className="text-xl font-semibold">Bio</h3>
            {currentUserId === userData?.id && (
              <Dialog.Root open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <Dialog.Trigger asChild>
                  <button
                    onClick={handleEditProfileClick}
                    className="absolute top-2 right-2 w-12 h-12 flex items-center justify-center rounded-md border border-midnight hover:bg-darkGreen transition-colors duration-300"
                  >
                    <Pencil size={20} />
                  </button>
                </Dialog.Trigger>
              </Dialog.Root>
            )}
          </CardHeader>
          <CardContent className="bg-transparent">
            <p className="text-gray-600">{petData?.bio || 'This user has no bio.'}</p>
          </CardContent>
        </Card>
      </div>


      {/* Medication Documents Section */}
      {currentUserId === userData?.id && (
        <div className="mb-4 relative">
          <Card>
            <CardHeader>
              <h3 className="text-xl font-semibold">Medication Documents</h3>
            </CardHeader>
            <CardContent>
              <MedicalDocCard />
              <input
                ref={documentInputRef}
                type="file"
                multiple
                hidden
                onChange={(e) => handleFileUpload(e, 'MedicalDocuments')}
              />

            </CardContent>
          </Card>

          <button
            onClick={() => documentInputRef.current?.click()}
            className="absolute top-2 right-2 w-12 h-12 flex items-center justify-center rounded-md border border-midnight hover:bg-darkGreen transition-colors duration-300"
          >
            <FilePlus2 />
          </button>
        </div>
      )}

      <hr className="my-2" /> {/* Horizontal line */}

      {/* Image Upload Section */}
      <div className="relative mb-4">
        {currentUserId === userData?.id && (
          <>
            <button
              onClick={() => imageInputRef.current?.click()}
              className="absolute top-0 right-16 w-12 h-12 flex items-center justify-center rounded-md border border-midnight hover:bg-darkGreen transition-colors duration-300"
            >
              <Upload />
            </button>
            <button
              className="absolute top-0 right-2 w-12 h-12 flex items-center justify-center rounded-md border border-midnight hover:bg-darkGreen transition-colors duration-300"
              onClick={() => setEditPhotos(!editPhotos)}
            >
              <Pencil />
            </button>
          </>
        )}

        <input
          ref={imageInputRef}
          type="file"
          multiple
          hidden
          onChange={(e) => handleFileUpload(e, 'PetAlbum')}
        />
        {/* Displaying Uploaded Images */}
        <div className="flex justify-center">
          <div className="mt-14 grid grid-cols-2 md:grid-cols-3 gap-2">
            {
              uploadedImages.map((imageUrl, index) => (
                <div key={index} className="w-72 h-96 relative">
                  {
                    (editPhotos) &&
                      <Dialog.Root key={index}>
                        <Dialog.Trigger>
                          <Trash2 key={index} className="absolute top-6 right-0 m-2 bg-red rounded-sm"/>
                        </Dialog.Trigger>
                        <Dialog.Portal>
                          <div
                            style={{ zIndex: 2147483647, position: 'absolute' }}
                            className=' left-8 top-40'
                          >
                            <Dialog.Overlay className="fixed inset-0 bg-darkGreen bg-opacity-50" />
                            <Dialog.Content className="bg-white border-4 border-midnight rounded-lg p-4 drop-shadow-2xl shadow-xl fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                              <Dialog.Title className=" font-semibold">Confirm Delete</Dialog.Title>
                              <Dialog.Description className="DialogDescription">
                                <p>
                                  Once a photo is deleted, it is unrecoverable.
                                </p>
                              </Dialog.Description>
                              <div style={{ display: 'flex', marginTop: 25, justifyContent: 'space-between' }}>
                                <Dialog.Close asChild>
                                  <Button
                                    className="bg-softGreen text-midnight hover:text-white"
                                    onClick={() => handleDeletePhotos(index)}
                                  >
                                    Yes
                                  </Button>
                                </Dialog.Close>

                                <Dialog.Close asChild>
                                  <Button aria-label="Close" className='bg-red text-midnight hover:text-white'>
                                    Cancel
                                  </Button>
                                </Dialog.Close>
                              </div>
                            </Dialog.Content>
                          </div>
                        </Dialog.Portal>
                      </Dialog.Root>
                  }
                  <ImageComponent imageUrl={imageUrl} />
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetProfileDisplay;
