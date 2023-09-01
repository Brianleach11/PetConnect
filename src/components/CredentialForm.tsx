'use client'
import { cn } from '@/lib/utils'
import { signIn } from 'next-auth/react'
import React, { FC, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { Icons } from './Icons'
import { supabase } from '@/lib/supabaseDbClient'

interface CredentialsFormProps extends React.HTMLAttributes<HTMLDivElement> {}

const CredentialsForm: FC<CredentialsFormProps> = ({ className, ...props }) => {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  const loginWithCredentials = async () => {
    setIsLoading(true)
    try {
      if (!email || !password) {
        toast({
          title: "Error",
          description: "Please enter both email and password",
          variant: 'destructive',
        })
        return
      }

      const emailRegex = /^[^\s@]+@[^\s@]+.[^\s@]+$/
      if (!emailRegex.test(email)) {
        toast({
          title: "Error",
          description: "Please enter a valid email",
          variant: 'destructive',
        })
        return
      }
const { data: user } = await supabase.from('users').select('*').eq('email', email).single()

      if (!user) {
        toast({
          title: "Error",
          description: "User not found. Create an account?",
          variant: 'destructive',
        })
        return
      }

      const result = await signIn('credentials', {
        email,
        password
      })
      if (result!.error) {
        toast({
          title: "Error",
          description: "There was an error logging in.",
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error logging in with this email",
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

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
  )
}

export default CredentialsForm
