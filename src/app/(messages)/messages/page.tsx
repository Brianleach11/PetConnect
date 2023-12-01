import { redirect } from 'next/navigation';
import supabaseServer from '@/components/supabaseServer';

export const dynamic = 'force-dynamic';

const MessagesPage = async () => {
    const { data: { session }, error: sessionError } = await supabaseServer().auth.getSession();

    // Redirect to login if there's no session or if there's an error
    if (!session || sessionError) {
        redirect('/');
    }


    return (
        <div className="flex items-center justify-center h-screen">
            <div className="p-5 text-center text-xl font-bold text-white ml-32 ">
                No chat has been selected.
            </div>
        </div>
    );






};

export default MessagesPage;
