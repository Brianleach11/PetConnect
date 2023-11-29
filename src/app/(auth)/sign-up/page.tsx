import SignUp from '@/components/SignUp'
import { FC } from 'react'

const page: FC = () => {
  return (
    <div className='absolute inset-0 bg-softGreen bg-opacity-25'>
      <div className='h-full max-w-2xl mx-auto flex flex-col items-center justify-center gap-20'>
        <SignUp/>
      </div>
    </div>
  )
}

export default page