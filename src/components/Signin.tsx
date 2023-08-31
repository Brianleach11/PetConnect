import Image from "next/image";
import UserAuthForm from '@/components/UserAuthForm'
import Link from 'next/link'

const SignIn = () => {
  return (
    <div className='container mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px] border-2 border-midnight border-opacity-100 rounded-lg'>
      <div className='flex flex-col space-y-2 text-center'>
        <Image src="/assets/logo.png" width={75} height={75} alt="Logo" className='mx-auto'/>
        <h1 className='text-2xl font-semibold tracking-tight'>Welcome back</h1>
        <p className='text-sm max-w-xs mx-auto'>
          Sign in to re-connect with your community!
        </p>
      </div>
      <h1 className="text-center font-bold">Email</h1>
      <input type="email" className="mx-auto border-2 border-midnight border-opacity-100 w-full rounded-sm"/>
      <h1 className="text-center font-bold">Password</h1>
      <input type="email" className="mx-auto border-2 border-midnight border-opacity-100 w-full rounded-sm"/>
      <div className="text-center font-bold">
        Or
      </div>
      <div className="text-center font-bold">
        Sign up with Google!
      </div>
      <UserAuthForm />
      <p className='px-8 text-center text-sm text-muted-foreground py-5'>
        New to Pet Connect?{' '}
        <Link
          href='/sign-up'
          className='hover:text-brand text-sm underline underline-offset-4'>
          Sign Up
        </Link>
      </p>
    </div>
  )
}

export default SignIn