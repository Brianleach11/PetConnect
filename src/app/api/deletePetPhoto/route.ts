import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {

    const username = process.env.NEXTCLOUD_USERNAME;
    const password = process.env.NEXTCLOUD_PASSWORD;
    const url = process.env.NEXTCLOUD_URL;

    const passedUrl = req.url?.split('=');
    const filename = passedUrl?.at(1)?.split('&').at(0);
    const petId = passedUrl?.at(passedUrl.length-1)
    const folder = passedUrl?.at(passedUrl.length-2)?.split('&').at(0)

    if(!filename) return new Response(JSON.stringify("No filename"), {status: 400})

    if (!username || !password || !url) {
        return new Response(JSON.stringify("Failed to get credentials for delete pet photo"), {status: 400});
    }

    try{
        const response = await fetch(`${url}/${folder}/${petId}/${filename}`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Basic ' + Buffer.from(username + ':' + password).toString('base64'),
            },
        });

        if (!response.ok) {
            throw new Error('Failed to upload file to Nextcloud');
        }

    }catch(error)
    {
        return new Response(JSON.stringify("Failed to delete pet photo"), {status:400})
    }
}