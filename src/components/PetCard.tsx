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

interface PetCardProps {
  pet: Database['public']['Tables']['pet']['Row'];
}

const PetCard: React.FC<PetCardProps> = ({ pet }) => {
  const [isCardHovered, setIsCardHovered] = useState(false);
  return (
    <div className="flex justify-center items-center mb-6"> 
        <Card 
            className={`w-72 transform transition-transform duration-300 ease-in-out ${isCardHovered ? 'shadow-lg' : 'shadow-md'}  rounded-lg border-2 border-gray-200`}
            onMouseEnter={() => setIsCardHovered(true)}
            onMouseLeave={() => setIsCardHovered(false)}
        >
            <CardHeader>
                <img
                    src="https://images.unsplash.com/photo-1561948955-570b270e7c36?fit=crop&w=500&h=500"
                    alt="Pet Image"
                    className="w-38 mx-auto rounded-full"
                />
            </CardHeader>
            
            <CardContent className="text-center font-sans">
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
                    {`Birthday: ${pet.birthday ? moment(pet.birthday).format('YYYY-MM-DD') : 'Loading...'}`}
                </CardDescription>
                
            </CardContent>

            <CardFooter className="flex justify-center gap-2.5 my-2">
                <Button
                    className="px-5 py-2.5 rounded-md hover:bg-gray-100 transition-colors duration-300"
                    onClick={() => console.log(`Connected with ${pet.name}`)}
                >
                    Connect
                </Button>
                <Button
                    className="px-5 py-2.5 rounded-md hover:bg-gray-100 transition-colors duration-300"
                    onClick={() => console.log(`Message sent to ${pet.name}`)}
                >
                    Message
                </Button>
            </CardFooter>
        </Card>
    </div>
);
  

};


export default PetCard;
