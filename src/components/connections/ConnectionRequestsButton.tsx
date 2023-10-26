'use client'

// Third-party imports
import { useRouter } from 'next/navigation';
import { ChevronRight } from 'lucide-react';

interface ConnectionRequestsButtonProps {
    unseenConnectionsCount: number;
}

const ConnectionRequestsButton: React.FC<ConnectionRequestsButtonProps> = ({ unseenConnectionsCount }) => {
    const router = useRouter();

    const handleClick = () => {
        console.log("redirecting to connection requests");
        router.push('/messages/requests');
    };

    const NotificationBadge = () => {
        const badgeWidth = `${Math.max(18, 10 + unseenConnectionsCount.toString().length * 12)}px`;

        return (
            <div className="bg-red rounded-full flex items-center justify-center" style={{ width: badgeWidth }}>
                {unseenConnectionsCount}
            </div>
        );
    };

    return (
        <button
            className="flex items-center w-full h-10 border-midnight text-midnight px-2 justify-between hover:shadow-md hover:ring-1 hover:ring-midnight rounded-lg"
            onClick={handleClick}
        >
            <div className="flex-1 flex items-center">
                <span className="mr-2">Connection Requests</span>
                <span className="text-blue-500">
                    {unseenConnectionsCount > 0 && <NotificationBadge />}
                </span>
            </div>
            <ChevronRight className="bg-midnight text-white rounded-full" />
        </button>
    );
}

export default ConnectionRequestsButton;
