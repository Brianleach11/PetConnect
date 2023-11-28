import { AuthType, createClient, WebDAVClient } from "webdav";
import { NextApiRequest } from 'next';

export async function GET(req: NextApiRequest) {

    const username = process.env.NEXTCLOUD_USERNAME;
    const password = process.env.NEXTCLOUD_PASSWORD;
    const url = process.env.NEXTCLOUD_URL;

    const passedUrl = req.url?.split('=');
    console.log(passedUrl)
    const filename = passedUrl?.at(1)?.split('&').at(0);
    const petId = passedUrl?.at(passedUrl.length-1)

    if(!filename) return new Response(JSON.stringify("No filename"), {status: 400})

    if (!username || !password || !url) {
        return new Response(JSON.stringify("Failed to get credentials for delete pet photo"), {status: 400});
    }

    try{
        const client = createClient(url, {
            username: username,
            password: password,
            authType: AuthType.Password
        })
        console.log("FILENAME: " + filename)
        console.log("PETID: " + petId)
        await client.deleteFile(`/PetAlbum/${petId}/${filename}`)

    }catch(error)
    {
        return new Response(JSON.stringify("Failed to delete pet photo"), {status:400})
    }
}