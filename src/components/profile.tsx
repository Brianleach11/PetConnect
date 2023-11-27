'use client'

import React, { useEffect, useState, useRef } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import moment from 'moment';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import OwnerPetCardList from '@/components/OwnerPetCardList';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import * as Dialog from '@radix-ui/react-dialog';
import { Pencil } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast';

const Profile: React.FC = () => {
  const [userData, setUserData] = useState<Database['public']['Tables']['user']['Row'] | null>(null);
  const [petData, setPetData] = useState<Database['public']['Tables']['pet']['Row'] | null>(null);
  const [isModalOpen, setModalOpen] = useState(false); // state to handle modal open/close

  // States for pet details
  const [name, setName] = useState("");
  const [petType, setPetType] = useState("");
  const [sex, setSex] = useState("");
  const [weight, setWeight] = useState("");
  const [breed, setBreed] = useState("");
  const [birthday, setBirthday] = useState("");
  const [bio, setBio] = useState("");
  const userAvatarRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [grabbingAvatar, setGrabbingAvatar] = useState<boolean>(false);
  const [avatar, setAvatar] = useState<string>("/sad-pet.jpg");
  // TODO: State for profilePicture if needed

  const supabase = createClientComponentClient<Database>();
  const router = useRouter();


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
  }

  const handleAddMorePets = () => {
    setModalOpen(true);
  }

  const handleSavePet = async () => {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (user?.id && !error) {

      if (user?.id) {
        const { data, error } = await supabase
          .from("pet")
          .insert({
            owner_id: user.id,
            name: name,
            pet_type: petType,
            sex: sex,
            weight: parseFloat(weight),
            breed: breed,
            birthday: birthday,
            bio: bio,
            // picture: profilePicture  // Uncomment this if you're handling images
          })
          .select();
        console.log('inside The insert');
        if (!error) {
          setModalOpen(false);
          router.refresh();
        }
      }
    }
  };

  const avatarUpload = async (event: any, folder: string) => {
    const file = event?.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    if (!userData || !userData.id) return;
    formData.append('id', userData.id.toString())
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

  useEffect(() => {
    const handleAvatar = async () => {
      try {
        if (!userData || !userData.id) return;
        if (grabbingAvatar) return;
        setGrabbingAvatar(true)

        const response = await fetch(`/api/getUserAvatar?userId=${userData?.id}`);

        if (!response.ok) {
          console.error('Failed to fetch user avatar:', response.statusText);
          return;
        }

        const images = await response.json();

        if (!images || !images.at(0)) {
          console.error('Invalid response format for user avatar:', images);
          return;
        }

        const baseUrl = process.env.NEXTCLOUD_USERAVATAR_URL
        const imageUrl = `${baseUrl}/${encodeURIComponent(userData.id)}/${encodeURIComponent(images.at(0).basename)}&x=1280&y=720&a=true`;

        setAvatar(imageUrl)
        setGrabbingAvatar(false)
      } catch (error) {
        console.log(error)
      }
    }
    handleAvatar()
  }, [userData])


  return (
    <div className="bg-gray-100 bg-opacity-25 lg:w-8/12 lg:mx-auto mb-8 p-4 md:p-8">
      <header className="flex items-start md:items-center mb-8 ml-8 md:ml-16">
        <div className="relative mr-10"> {/* Parent container with relative positioning */}
          <img
            className="w-20 h-20 md:w-40 md:h-40 object-cover rounded-full border-2 border-pink p-1"
            src={avatar}
            alt="Dog Image"
            width={160}
            height={160}
          />
          <button
            onClick={() => userAvatarRef.current?.click()}
            className="absolute bottom-0 right-0 ml-3 mb-3  flex items-center justify-center rounded-md hover:bg-darkGreen transition-colors duration-300"
            style={{ transform: 'translate(-15%, 50%)' }} // Adjusts the position for precise alignment
          >
            <Pencil />
          </button>
        </div>

        <input
          ref={userAvatarRef}
          type="file"
          multiple
          hidden
          onChange={(e) => avatarUpload(e, 'UserAvatar')}
        />
        <div>
          <h2 className="text-2xl font-semibold mb-1">
            {userData?.username || 'Username'}
          </h2>
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

      <hr className="my-4" />

      <div className="flex items-center justify-center mb-4">
        <span className="text-3xl mr-4">🐾</span>
        <h2 className="text-2xl font-semibold">My Pets</h2>
        <button onClick={handleAddMorePets} className="ml-4 underline hover:text-blue-600 cursor-pointer">
          Add More Pets
        </button>
        <span className="text-2xl mr-4"> 🎖️</span>
      </div>

      <div className="flex justify-center">
        <div className="grid grid-cols-1">
          <OwnerPetCardList userId={userData?.id || ''} />
        </div>
      </div>

      <Dialog.Root open={isModalOpen} onOpenChange={setModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-opacity-75 bg-darkGreen" />
          <Dialog.Content className="fixed top-[50%] left-[50%] max-h-[90vh] w-[90vw] max-w-[500px] overflow-y-auto translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white p-[30px] shadow-xl border-t-8 border-softGreen">

            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-darkGreen">
                Add New Pet 🐾
              </h3>
              <Dialog.Close asChild>
                <button className="focus:outline-none">
                  <span>✖️</span>
                </button>
              </Dialog.Close>
            </div>

            <div className="mt-8 space-y-4">
              {/* Pet Name */}
              <label htmlFor="name" className="block text-softBlue text-lg font-semibold mb-1">Name:</label>
              <input
                id="name"
                type="text"
                className="border-2 border-softBlue w-full rounded-md h-10 text-midnight px-3 py-2"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              {/* Pet Type */}
              <label htmlFor="petType" className="block text-softBlue text-lg font-semibold mb-1">Type (e.g., Dog, Cat):</label>
              <input
                id="petType"
                type="text"
                className="border-2 border-softBlue w-full rounded-md h-10 text-midnight px-3 py-2"
                value={petType}
                onChange={(e) => setPetType(e.target.value)}
              />

              {/* Pet Gender */}
              <label htmlFor="sex" className="block text-softBlue text-lg font-semibold mb-1">Sex:</label>
              <select
                id="sex"
                value={sex}
                onChange={(e) => setSex(e.target.value)}
                className="border-2 border-softBlue w-full rounded-md h-10 text-midnight px-3 py-2"
              >
                <option value="">Select a gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>

              {/* Pet Weight */}
              <label htmlFor="weight" className="block text-softBlue text-lg font-semibold mb-1">Weight (in lbs):</label>
              <input
                id="weight"
                type="number"
                className="border-2 border-softBlue w-full rounded-md h-10 text-midnight px-3 py-2"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />

              {/* Pet Breed */}
              <label htmlFor="breed" className="block text-softBlue text-lg font-semibold mb-1">Breed:</label>
              <input
                id="breed"
                type="text"
                className="border-2 border-softBlue w-full rounded-md h-10 text-midnight px-3 py-2"
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
              />

              {/* Pet Birthday */}
              <label htmlFor="birthday" className="block text-softBlue text-lg font-semibold mb-1">Birthday:</label>
              <input
                id="birthday"
                type="date"
                className="border-2 border-softBlue w-full rounded-md h-10 text-midnight px-3 py-2"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
              />



              {/* Pet Bio */}
              <label htmlFor="bio" className="block text-softBlue text-lg font-semibold mb-1">Short Bio:</label>
              <textarea
                id="bio"
                rows={4}
                className="border-2 border-softBlue w-full rounded-md text-midnight px-3 py-2"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />

              {/* TODO: Add input for profilePicture, microchip number, vaccinations, etc. if needed */}
            </div>

            <div className="mt-6 flex justify-end">
              <Button
                className="px-5 py-2 bg-softGreen text-black rounded-md hover:bg-lightblue transition-colors duration-300"
                onClick={handleSavePet}
              >
                Save Pet
              </Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

    </div>
  );
}

export default Profile;

