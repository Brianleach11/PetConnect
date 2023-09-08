'use client'
import { cn } from '@/lib/utils';
import React, { FC, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation';

interface SignUpFormProps extends React.HTMLAttributes<HTMLDivElement> {}

const SignUpForm: FC<SignUpFormProps> = ({ className, ...props }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const supabase = createClientComponentClient();
  const router = useRouter()

  const signUpWithCredentials = async () => {
    setIsLoading(true);
    try {
      if (!email || !password || !confirmPassword) {
        toast({
          title: "Error",
          description: "Please fill out all fields",
          variant: 'destructive',
        });
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toast({
          title: "Error",
          description: "Please enter a valid email",
          variant: 'destructive',
        });
        return;
      }

      if (password !== confirmPassword) {
        toast({
          title: "Error",
          description: "Passwords do not match",
          variant: 'destructive',
        });
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${location.origin}`
        }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Account Created! Check your email and confirm your identity.",
        variant: "default",
      });

      // delay to give a user chance to read the succefull message

    } catch (error: unknown) {
      if (error instanceof Error) {
        toast({
          title: "Error",
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: "Error",
          description: "An unknown error occurred",
          variant: 'destructive',
        });
      }
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
        <h1 className="text-center font-bold">Confirm Password</h1>
        <input 
          type="password"
          className="mx-auto border-2 border-midnight border-opacity-100 w-full rounded-sm"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <div className="py-5">
          <Button 
            onClick={signUpWithCredentials}
            isLoading={isLoading}
            type='button'
            size='sm'
            className='w-full'
            disabled={isLoading}
          >
            Sign Up
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
