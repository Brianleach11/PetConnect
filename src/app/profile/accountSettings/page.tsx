import { FC } from "react";
import { redirect } from "next/navigation";
import NavBar from '@/components/NavBar'
import AccountSettingsCard from "@/components/AccountSettingsCard";
import supabaseServer from "@/components/supabaseServer";

const AccountSettings: FC = async () => {
  const {
    data: { session },
  } = await supabaseServer().auth.getSession();

  if(!session) redirect('/')

  return (
    <div className="flex flex-col min-h-screen bg-white">
        <NavBar session={session} authToken={false} />
        <AccountSettingsCard userId={session.user.id}/>
    </div>
  );
};

export default AccountSettings;