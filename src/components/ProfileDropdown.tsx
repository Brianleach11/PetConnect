'use client'
import { Button } from "@/components/ui/button"
import {
    LogOut,
    Settings,
    User,
    PawPrint
  } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

export default function ProfileDropdown(){
    const supabase = createClientComponentClient()
    const router = useRouter()

    const handleSignOut = async () => {
        try {
          console.log("logging out")
          await supabase.auth.signOut();
          await router.refresh();
        } catch (error) {
          console.error(error);
          alert("Error logging out. Check console for details.");
        }
      };

    return(
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button>Menu</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        <User className="mr-2 h-4 w-4"/>
                        <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <PawPrint className="mr-2 h-4 w-4"/>
                        <span>Pets</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <LogOut className="mr-2 h-4 w-4"/>
                    <span onClick={handleSignOut}>Sign Out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}