import { NextApiResponse } from 'next';
import {createClient, AuthType } from "webdav"
import { NextRequest } from "next/server";

interface documents {
    filename:string;
    basename: string,
    lastmod: string,
    size: string,
    type: string,
    etag: string,
    mime: string
}

export async function POST(req: NextRequest, res: NextApiResponse) {
    let createFolder = false;
    const newAvatar = false;
    const data = await (req as any).formData()
    const id = data.get('id') as string | number | boolean;
    const folder = data.get('folder') as string | number | boolean;

    const username = process.env.NEXTCLOUD_USERNAME
    const password = process.env.NEXTCLOUD_PASSWORD
    const url = process.env.NEXTCLOUD_URL

    if(!username || !password || !url)
    {
        return new Response(JSON.stringify("Env credentials failed, uploadAvatar"), {status: 400});
    }

    if(id === "" || id === undefined) return new Response(JSON.stringify("No user id uploadAvatar"), {status: 400})
    
    const client = createClient(url, {
        username: username,
        password: password,
        authType: AuthType.Password
    })
    
    try{
        const exists = await client.exists(`/${folder}/${id}`);
        if(!exists) createFolder = true; 
    }catch(error)
    {
        return new Response(JSON.stringify(`Failed to check existance of avatar folder ${folder}`), {status: 400})
    }

    if(createFolder){
        try{
            const response = await client.createDirectory(`/${folder}/${id}`)
        }
        catch(error)
        {
            return new Response(JSON.stringify(`Failed to create folder in ${folder}`), {status: 400})
        }
    }
    else{
        try{
            const response = await client.getDirectoryContents(`/${folder}/${id}`)
            const stringified = JSON.stringify(response);
            const formatted = JSON.parse(stringified) as documents[];

            if(formatted.at(0)){
                await client.deleteFile(`/${folder}/${id}/${formatted.at(0)?.basename}`)
            }
        }catch(error){
            return new Response(JSON.stringify(`Failed to get contents in ${folder}`), {status: 400})
        }
    }
    
    try {
        const file = data.get('file') as unknown as File;

        if (!file) {
            return new Response(JSON.stringify("No file found in the request."), {status: 400});
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const response = await fetch(`${url}/${folder}/${id}/${file.name}`, {
            method: 'PUT',
            headers: {
                'Authorization': 'Basic ' + Buffer.from(username + ':' + password).toString('base64'),
                'Content-Type': file.type || 'application/octet-stream',
            },
            body: buffer,
        });

        if (!response.ok) {
            throw new Error('Failed to upload file to Nextcloud');
        }

        return response;
    } catch (error) {
        console.error("Error: " + error);
        return new Response(JSON.stringify("Error: " + error), {status: 500})
    }
}
