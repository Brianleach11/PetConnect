'use client'
import { cn } from '@/lib/utils';
import React, { FC, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { Database } from '@/types/supabase';

interface CredentialsFormProps extends React.HTMLAttributes<HTMLDivElement> {}

const CredentialsForm: FC<CredentialsFormProps> = ({ className, ...props }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const supabase = createClientComponentClient();
  const router = useRouter()

  const loginWithCredentials = async () => {
    const supabase = createClientComponentClient<Database>();
    setIsLoading(true);
    try {
      if (!email || !password) {
        toast({
          title: "Error",
          description: "Please enter both email and password",
          variant: 'destructive',
        });
        return;
      }
  
      const emailRegex = /^[^\s@]+@[^\s@]+.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toast({
          title: "Error",
          description: "Please enter a valid email",
          variant: 'destructive',
        });
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: 'destructive',
        });
        return;
      }
     
      
      const { data: userData, error: userError } = await supabase
        .from('user')
        .select('username')
        .eq('id', data.user.id)
        .single();

        if (!userData?.username) {
          console.log("No userData, redirecting to profile setup.");
          toast({
            title: 'Notice',
            description: 'No data for user. Redirecting to profile setup...',
            variant: 'default',
          });
          router.push('/userProfile');
        } else {
          // Check for existing pet data
          const { data: petData, error: petError } = await supabase
            .from('pet')
            .select('*')
            .eq('owner_id', data.user.id)
            .single();
      
          if (!petData) {
            console.log("No petData, redirecting to pet profile setup.");
            toast({
              title: 'Notice',
              description: 'No pet profile found. Redirecting to pet profile setup...',
              variant: 'default',
            });
            router.push('/petProfile');

          } else {

          toast({
            title: 'Success',
            description: 'Logged in successfully!',
            variant: 'default',
          });
          router.push('/');
        }
      }
    
    }
    catch (error) {
      toast({
        title: "Error",
        description: "There was an error logging in.",
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn('flex justify-center', className)} {...props}>
      <div>
        <h1 className="text-center font-bold">Email</h1>
        <input 
          type="email"
          className="mx-auto border-2 border-midnight border-opacity-100 w-full rounded-sm"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <h1 className="text-center font-bold">Password</h1>
        <input 
          type="password"
          className="mx-auto border-2 border-midnight border-opacity-100 w-full rounded-sm"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="py-5">
          <Button 
            onClick={loginWithCredentials}
            isLoading={isLoading}
            type='button'
            size='sm'
            className='w-full'
            disabled={isLoading}
          >
            Login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CredentialsForm;
