import { FC } from "react";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import NavBar from '@/components/NavBar'
import AccountSettingsCard from "@/components/AccountSettingsCard";

const AccountSettings: FC = async () => {
    const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if(!session) redirect('/')

  //delete user from supabase, delete user/pet folders from all nextcloud folders
  //change email
  //change username

  return (
    <div className="flex flex-col min-h-screen bg-white">
        <NavBar session={session} authToken={false} />
        <AccountSettingsCard userId={session.user.id}/>
    </div>
  );
};

export default AccountSettings;