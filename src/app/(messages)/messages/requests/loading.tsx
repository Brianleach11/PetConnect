import { Button } from "@/components/ui/button";

export default function Loading () {
    return (
        <div className="h-screen bg-midnight flex items-center justify-center">
            <div className="py-2 pt-14 fixed right-0 w-2/3 h-screen">
                <div className="container px-2 bg-white rounded-tr-xl h-full border-l-2 drop-shadow-lg flex items-center justify-center">
                    <div className="border-4 border-solid border-gray-400 border-t-blue-500 rounded-full w-10 h-10 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                </div>
            </div>
        </div>
    )
}