'use client'
import React, { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';  
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation'; 
import { useToast } from '@/components/ui/use-toast'; 
import { Database } from '@/types/supabase';


const supabase = createClientComponentClient<Database>();

const PetProfileForm = () => {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const { toast } = useToast();

  const [name, setName] = useState<string>('');
  const [petType, setPetType] = useState<string>('');
  const [breed, setBreed] = useState<string>('');
  const [sex, setSex] = useState<string>('');
  const [weight, setWeight] = useState<number | null>(null);
  const [age, setAge] = useState<number | null>(null);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [bio, setBio] = useState<string>('');

  const {data: {pet}, error} = await supabase.auth.getUser()

  if(pet?.id && !error){
    const {data, error} = await supabase
      .from("pet")
      .insert(
        {
          id: pet?.id, 
          name: name, 
          pet_Type: petType, 
          sex: sex, 
          weight: weight, 
          breed: breed,
          birthday: age,
          bio: bio,
          picture: profilePicture
        }
      )
      .select()
      console.log('inside The insert')
    if(error) throw error
    
    if(data.length !== 0){
      console.log('pushPetProfile')
      router.push('/petProfile')
    }
  }else{
    toast({
      title: "Error",
      description: "An error happend upon user login",
      variant: 'destructive',
    })
  }

  return (
    <Card className="w-full max-w-md mx-auto mt-10">
      <CardHeader>
        <CardTitle>Pet Profile Form</CardTitle>
        <CardDescription>Create your pet profile</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          {/* Existing Form Fields */}
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setName(e.target.value)
            }
          />

               {/* Pet Type */}
               <Label htmlFor="petType">Pet Type</Label>
          <Select>
            <SelectTrigger id="petType">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem value="dog">Dog</SelectItem>
              <SelectItem value="cat">Cat</SelectItem>
              <SelectItem value="bird">Bird</SelectItem>
              <SelectItem value="reptile">Reptile</SelectItem>
              <SelectItem value="fish">Fish</SelectItem>
              {/* we can add more options here */}
            </SelectContent>
          </Select>

         {/* Sex */}
         <Label htmlFor="sex">Sex</Label>
          <Select>
            <SelectTrigger id="sex">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              {/* Add more options as needed */}
            </SelectContent>
          </Select>

          <Label htmlFor="weight">Weight</Label>
          <Input
            id="weight"
            type="number"
            value={weight ?? ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setWeight(Number(e.target.value))
            }
          />

          {/* Existing Form Fields */}
          <Label htmlFor="breed">Breed</Label>
          <Input
            id="breed"
            value={breed}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setBreed(e.target.value)
            }
          />

          <Label htmlFor="age">Age</Label>
          <Input
            id="age"
            type="number"
            value={age ?? ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setAge(Number(e.target.value))
            }
          />


          <Label htmlFor="bio">Bio - Know About Me</Label>
          <Textarea
            id="bio"
            value={bio}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setBio(e.target.value)
            }
          />

          {/* Profile Picture Upload */}
          <Label htmlFor="profilePicture">Profile Picture</Label>
          <input
            type="file"
            id="profilePicture"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setProfilePicture(e.target.files?.[0] ?? null)
            }
          />
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => {
            router.push('/userProfile');
          }}
        >
          Back
        </Button>
        <Button
          onClick={() => {
            /* Implement next steps or final submission */
          }}
        >
          Submit
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PetProfileForm;
