'use client'
import React, { useEffect, useState } from 'react';
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


const PetProfileForm = () => {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const { toast } = useToast();

  const [name, setName] = useState<string>('');
  const [petType, setPetType] = useState<string>('');
  const [breed, setBreed] = useState<string>('');
  const [sex, setSex] = useState<string>('');
  const [weight, setWeight] = useState<number | null>(null);
  const [birthday, setBirthday] = useState<string | null>(null);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [bio, setBio] = useState<string>('');

  const handleSubmit = async() => {

        // Validation
        let newErrors = {};
        if (!name) newErrors = 'Name is required';
        if (!petType) newErrors = 'Pet Type is required';
        if (!sex) newErrors = 'Sex is required';
        if (!weight) newErrors = 'Weight is required';
        if (!birthday) newErrors = { ...newErrors, birthday: 'Birthday is required' };
        if (!breed) newErrors = 'Breed is required';
        if (!bio) newErrors = 'Bio is required';
    
        if (Object.keys(newErrors).length > 0) {
          // Show errors in toast
          toast({
            title: "Validation Error",
            description: "Please fill in all the required fields",
            variant: 'destructive',
          });
          return;
        }


  const {data: {user}, error} = await supabase.auth.getUser()

  if(user?.id && !error){
    
    const {data, error} = await supabase
      .from("pet")
      .insert(
        {
          owner_id: user?.id,
          name: name, 
          pet_type: petType, 
          sex: sex, 
          weight: weight, 
          breed: breed,
          birthday: birthday,
          bio: bio,
          picture: profilePicture
        }
      )
      .select()
      console.log('inside The insert')
    if(error) throw error
    
    if(data.length !== 0){
      console.log('pushPetProfile')
      router.push('/MedPage')
    }
  }else{
    toast({
      title: "Error",
      description: "An error happend upon user login",
      variant: 'destructive',
    })
  }
  }
  return (
    <Card className="w-full max-w-2xl mx-auto mt-10">
      <CardHeader>
        <CardTitle>Pet Profile Form</CardTitle>
        <CardDescription>Create your pet profile</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setName(e.target.value)
            }
          />
  
          <div className="relative">
            <Label htmlFor="petType">Pet Type</Label>
            <Select onValueChange={(value) => setPetType(value)}>
              <SelectTrigger id="petType">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="dog">Dog</SelectItem>
                <SelectItem value="cat">Cat</SelectItem>
                {/* ... other options */}
              </SelectContent>
            </Select>
          </div>
  
          <div className="relative">
            <Label htmlFor="sex">Sex</Label>
            <Select onValueChange={(value) => setSex(value)}>
              <SelectTrigger id="sex">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                {/* ... */}
              </SelectContent>
            </Select>
          </div>
  
          <Label htmlFor="weight">Weight</Label>
          <Input
            id="weight"
            type="number"
            value={weight ?? ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setWeight(Number(e.target.value))
            }
          />
  
          <Label htmlFor="breed">Breed</Label>
          <Input
            id="breed"
            value={breed}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setBreed(e.target.value)
            }
          />
  
          <Label htmlFor="birthday">Birthday</Label>
          <Input
            id="birthday"
            type="date"
            value={birthday || ''}
            onChange={(e) => setBirthday(e.target.value)}
          />
  
          <Label htmlFor="bio">Bio - Know About Me</Label>
          <Textarea
            id="bio"
            value={bio}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setBio(e.target.value)
            }
          />
  
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
        <Button onClick={handleSubmit}>
          Next
        </Button>
      </CardFooter>
    </Card>
  );
  
};

export default PetProfileForm;
