import { AuthType, createClient, FileStat } from "webdav";
import { NextApiRequest } from 'next';

export async function GET(req: NextApiRequest) {
    const username = process.env.NEXTCLOUD_USERNAME;
    const password = process.env.NEXTCLOUD_PASSWORD;
    const url = process.env.NEXTCLOUD_URL;

    const passedUrl = req.url?.split('=');
    const petId = passedUrl?.at(1);

    if(!petId) return new Response(JSON.stringify("No petID"), {status: 400})

    if (!username || !password || !url) {
        return new Response(JSON.stringify("Failed to get credentials for get medical documents"), {status: 400});
    }

    try{
        const client = createClient(url, {
            username: username,
            password: password,
            authType: AuthType.Password
        })
        const directoryContents = await client.getDirectoryContents(`/PetAlbum/${petId}`) as FileStat[];
        
        const fileDetails = directoryContents.map((file) => ({
            basename: file.basename,
        }));
    
        const stringified = JSON.stringify(fileDetails);
    
        const formatted = JSON.parse(stringified) as { basename: string }[];
    
        return new Response(JSON.stringify(formatted), { status: 200 });
    }catch(error){
        return new Response(JSON.stringify('Failed to fetch medical documents'), {status: 500});
    }

}