'use client'
import { useRouter } from "next/navigation"

export default function Page() {
    const router = useRouter()
    router.refresh()
    return(
        <div className='absolute inset-0 bg-softGreen'>
            <div className='h-full max-w-2xl mx-auto flex flex-col items-center justify-center gap-20'>
                You are being redirected...
            </div>
        </div>
    )
}