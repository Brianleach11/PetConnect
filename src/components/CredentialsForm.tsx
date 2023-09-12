'use client'
import { cn } from '@/lib/utils';
import React, { FC, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';


interface CredentialsFormProps extends React.HTMLAttributes<HTMLDivElement> {}

const CredentialsForm: FC<CredentialsFormProps> = ({ className, ...props }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const supabase = createClientComponentClient();
  const router = useRouter()

  const loginWithCredentials = async () => {
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
     
/*      // Fetch user record to check for first login
    const {data,error} = await supabase
    .from('user')
    .select('')
    .eq('id', data?.user?.id);

  if (fetchError) {
    toast({
      title: "Error",
      description: fetchError.message,
      variant: 'destructive',
    });
    return;
  }

  const isFirstLogin = userRecord && !userRecord[0]?.first_login;

  // Update first_login field if necessary
  if (isFirstLogin) {
    const { error: updateError } = await supabase
      .from('users')
      .update({ first_login: new Date() })
      .eq('id', data?.user?.id);

    if (updateError) {
      toast({
        title: "Error",
        description: updateError.message,
        variant: 'destructive',
      });
      return;
    }

    // Redirect to special first-time user page
    router.push('/userProfile');
    return;
  }
*/
      toast({
        title: "Success",
        description: "Logged in successfully!",
        variant: 'default',
      });

      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
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
