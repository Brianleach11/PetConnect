import { NextApiRequest, NextApiResponse } from 'next';
import {createClient, AuthType } from "webdav"

export async function POST(req: NextApiRequest, res: NextApiResponse) {
    let createFolder = false;
    const data = await (req as any).formData()
    const petId = data.get('petId') as string | number | boolean;
    const folder = data.get('folder') as string | number | boolean;

    const username = process.env.NEXTCLOUD_USERNAME
    const password = process.env.NEXTCLOUD_PASSWORD
    const url = process.env.NEXTCLOUD_URL

    if(!username || !password || !url)
    {
        return new Response(JSON.stringify("Env credentials failed"), {status: 400});
    }

    if(petId === "" || petId === undefined) return new Response(JSON.stringify("No user id"), {status: 400})
    
    const client = createClient(url, {
        username: username,
        password: password,
        authType: AuthType.Password
    })
    
    try{
        const exists = await client.exists(`/${folder}/${petId}`);
        if(!exists) createFolder = true; 
    }catch(error)
    {
        return new Response(JSON.stringify("Failed to check existance"), {status: 400})
    }

    if(createFolder){
        //create the folder before trying to upload
        try{
            console.log("Creating medical documents user folder")
            const response = await client.createDirectory(`/${folder}/${petId}`)
        }
        catch(error)
        {
            return new Response(JSON.stringify("Failed to create medical documents user folder"), {status: 400})
        }
    }
    
    try {
        const file = data.get('file') as unknown as File;

        if (!file) {
            return new Response(JSON.stringify("No file found in the request."), {status: 400});
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const response = await fetch(`${url}/${folder}/${petId}/${file.name}`, {
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