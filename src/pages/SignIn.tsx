import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { supabase } from '../lib/supabaseClient'; 
import Image from "next/image";
import UserAuthForm from '@/components/UserAuthForm'
import Link from 'next/link'


const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailSignIn = async () => {
    if (!email || !password) {
      alert("Please enter both email and password");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address");
      return;
    }

    const { user, error } = await supabase.auth.signIn({ email, password });

    if (user) {
      // Successfully signed in
      signIn('credentials', { 
        email, 
        password,
        callbackUrl: `${window.location.origin}/your-callback-url`
      });
    } else {
      // Show error message
      alert(`Error: ${error?.message}`);
    }
  };

  return (
    <div className='absolute inset-0'>
      <div className='h-full max-w-2xl mx-auto flex flex-col items-center justify-center gap-20'>
        <div className='container mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]'>
            <div className='flex flex-col space-y-2 text-center'>
                <Image src="/assets/logo.png" width={75} height={75} alt="Logo" className='mx-auto'/>
                <h1 className='text-2xl font-semibold tracking-tight'>Welcome back</h1>
                <p className='text-sm max-w-xs mx-auto'>
                Sign in to re-connect with your community!
                </p>
            </div>

            <h1>Email</h1>
            <div>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <h1>Password</h1>
            <div>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div>
                or sign in with Google!
            </div>
            <UserAuthForm />
            <p className='px-8 text-center text-sm text-muted-foreground'>
                New to Pet Connect?{' '}
                <Link
                    href='/sign-up'
                    className='hover:text-brand text-sm underline underline-offset-4'>
                    Sign Up
                </Link>
            </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
