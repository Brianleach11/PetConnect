'use client'
import React, { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'; 
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation'; 
import { useToast } from '@/components/ui/use-toast'; 
import { Database } from '@/types/supabase';

const UserProfileForm = () => {
  const supabase = createClientComponentClient<Database>();
  const { toast } = useToast();
  const router = useRouter();
  const [username, setUsername] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [state, setState] = useState<string>('');
  const [gender, setGender] = useState<string>('');
  const [birthday, setBirthday] = useState<string>('');
  const [lookingFor, setLookingFor] = useState<string>('');

  useEffect(() => {
    const savedFormData = JSON.parse(localStorage.getItem('userProfileForm') || '{}');
    setUsername(savedFormData.username || '');
    setBirthday(savedFormData.birthday || '');
    setCity(savedFormData.city || '');
    setState(savedFormData.state || '');
    setGender(savedFormData.gender || '');
    setLookingFor(savedFormData.lookingFor || '');
  }, []);

  const handleSubmit = async() => {
    
    if (!username) {
      toast({
        title: "Error",
        description: "Please enter username",
        variant: 'destructive',
      });
      return;
    }

    if (!birthday) {
      toast({
        title: "Error",
        description: "Please enter your Birthday",
        variant: 'destructive',
      });
      return;
    }

    if (!city) {
      toast({
        title: "Error",
        description: "Please enter your City",
        variant: 'destructive',
      });
      return;
    }

    if (!state) {
      toast({
        title: "Error",
        description: "Please enter your State",
        variant: 'destructive',
      });
      return;
    }
    localStorage.setItem('userProfileForm', JSON.stringify({
      username,
      birthday,
      city,
      state,
      gender,
      lookingFor,
    }));

    const {data: {user}, error} = await supabase.auth.getUser()
    console.log(user)

    if(user?.id && !error){
      const {data, error} = await supabase
        .from("user")
        .upsert(
          {
            id: user?.id, 
            username: username, 
            birthday: birthday, 
            gender: gender,
            city: city, 
            state: state, 
            looking_for: lookingFor
          }
        )
        .select()
      
    if(error) throw error
        
    if(username && birthday && city && state) {
          console.log('/petProfile');  // This will log the message to the console
          router.push('/petProfile');
        }

    }else{
      toast({
        title: "Error",
        description: "An error happend upon user login",
        variant: 'destructive',
      })
    }

  };

  return (
    <Card className="w-full max-w-3xl mt-10 min-h-[700px] ">
      <CardHeader>
        <CardTitle>User Profile Form</CardTitle>
        <CardDescription>Complete your profile</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <Label htmlFor="birthday">Birthday</Label>
          <Input
            id="birthday"
            type="date"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
          />

          <Label htmlFor="gender">Gender</Label>
          <Select
          
          onValueChange={(value) => setGender(value)}  
        >
          
        
            <SelectTrigger id="gender">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>

          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />

          <Label htmlFor="state">State</Label>
          <Input
            id="state"
            value={state}
            onChange={(e) => setState(e.target.value)}
          />

          <Label htmlFor="lookingFor">Looking For</Label>
          <Select
            onValueChange={(value) => setLookingFor(value)} 
            >
            <SelectTrigger id="lookingFor">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem value="playdates">Playdates</SelectItem>
              <SelectItem value="breeding">Breeding</SelectItem>
              <SelectItem value="info">General Information</SelectItem>
            </SelectContent>
          </Select>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => {
            router.push('/login');
          }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit}>
          Next
        </Button>
      </CardFooter>
    </Card>
  );
};

export default UserProfileForm;
