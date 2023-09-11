import Image from "next/image";
import UserAuthForm from '@/components/UserAuthForm'
import CredentialsForm from "@/components/CredentialsForm";
import Link from 'next/link'

const Login = () => {
  return (
    <div className='py-4 container bg-whiteGreen mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px] border-2 border-midnight border-opacity-100 rounded-lg'>
      <Link href="/" className="text-left hover:text-brand text-sm underline underline-offset-4"> Home</Link>
      <div className='flex flex-col space-y-2 text-center'>
        <Image src="/assets/logo.png" priority width={75} height={75} alt="Logo" className='mx-auto'/>
        <h1 className='text-2xl font-semibold tracking-tight'>Welcome back</h1>
        <p className='text-sm max-w-xs mx-auto'>
          Sign in to re-connect with your community!
        </p>
      </div>
      <CredentialsForm/>
      <div className="text-center font-bold">
        Or
      </div>
      <div className="text-center font-bold">
        Continue with Google!
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

export default Login