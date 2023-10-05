
'use client'
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
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation'; 
import React, { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';

const MedForm = () => {
  const { toast } = useToast();
  const router = useRouter();
  
  const [vaccinationDate, setVaccinationDate] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [file, setFile] = useState(null);

  const handleSubmit = () => {
    // Handle form submission logic here

    // For example, checking if the fields are filled
    if(!vaccinationDate || !expirationDate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: 'destructive',
      });
      return;
    }
    
    // Redirect or perform additional actions
    router.push('/successPage');
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-10">
      <CardHeader>
        <CardTitle>Vaccination & Medication</CardTitle>
        <CardDescription>Enter your pets health details</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <Label htmlFor="vaccinationDate">Vaccination Date</Label>
          <Input
            id="vaccinationDate"
            type="date"
            value={vaccinationDate}
            onChange={() => {}}
          />

          <Label htmlFor="expirationDate">Expiration Date</Label>
          <Input
            id="expirationDate"
            type="date"
            value={expirationDate}
            onChange={() => {}}
          />

          <Label htmlFor="medicationFile">Medication File</Label>
          <input 
            type="file" 
            id="medicationFile" 
            onChange={() => {}}
          />
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => {
            router.push('/petProfile');
          }}
        >
          Back
        </Button>
        <Button 
          onClick={handleSubmit}>
          Submit
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MedForm;
