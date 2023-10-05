'use client'
import { useRouter } from 'next/navigation'
import { ChevronRight } from 'lucide-react';

const ConnectionRequestsButton = ({unseenConnectionsCount}:{unseenConnectionsCount:number}) => {
    const router = useRouter()
    const handleClick = () =>{
        console.log("redirecting to connection requests")
        router.push('/messages/requests')
    }
  return (
    <div className="flex items-center w-full h-10 border-midnight text-midnight px-2 justify-between hover:shadow-md hover:ring-1 hover:ring-midnight rounded-lg"
        onClick={()=>handleClick()}
    >
        <div className="flex-1 flex items-center">
            <span className="mr-2">Connection Requests</span>
            <span className="text-blue-500">{
                unseenConnectionsCount > 0 ? 
                <div className="bg-red rounded-full w-6 h-6 flex items-center justify-center"
                    style={{
                        width: `${Math.max(18, 10 + unseenConnectionsCount.toString().length * 12)}px`
                    }}
                >
                    {unseenConnectionsCount}
                </div>
                : <div/>
            }
            </span>
        </div>
        <div>
            <ChevronRight className="bg-midnight text-white rounded-full" />
        </div>
    </div>
  )
}

export default ConnectionRequestsButton