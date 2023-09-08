import Image from "next/image";
import Link from 'next/link';
import SignUpForm from '@/components/SignUpForm';

const SignUp = () => {
  return (
    <div className='container py-4 mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px] bg-whiteGreen border-2 border-midnight border-opacity-100 rounded-lg'>
      <div className='flex justify-between'>
        <Link href="/" className="text-left hover:text-brand text-sm underline underline-offset-4"> Home</Link>
        <Link href="/login" className="text-left hover:text-brand text-sm underline underline-offset-4">Login</Link>
      </div>
      <div className='flex flex-col space-y-2 text-center'>
        <Image src="/assets/logo.png" width={75} height={75} alt="Logo" className='mx-auto'/>
        <h1 className='text-2xl font-semibold tracking-tight'>Welcome to</h1>
        <h1 className='text-2xl font-semibold tracking-tight'>Pet Connect!</h1>
        <p className='text-sm max-w-xs mx-auto'>
          Create an account to start building relationships!
        </p>
      </div>
      <SignUpForm />
    </div>
  )
}

export default SignUp;
