import { Button, buttonVariants } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <div>
      <div>Hello world</div>
          <Link href="/hello" className={buttonVariants({ variant: "destructive" })}>Click here</Link>
    </div>
    
  )
}
