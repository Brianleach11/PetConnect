import { NextApiRequest, NextApiResponse } from 'next';
import {createClient, AuthType } from "webdav"

export const config = {
    api: {
        bodyParser: false
    }
};

export async function POST(req: NextApiRequest, res: NextApiResponse) {
    let createFolder = false;
    const data = await (req as any).formData()
    const userId = data.get('userId') as string | number | boolean;

    const username = process.env.NEXTCLOUD_USERNAME
    const password = process.env.NEXTCLOUD_PASSWORD
    const url = process.env.NEXTCLOUD_URL

    if(!username || !password || !url)
    {
        return new Response(JSON.stringify("Env credentials failed"), {status: 400});
    }

    if(userId === "" || userId === undefined) return new Response(JSON.stringify("No user id"), {status: 400})
    
    console.log("ID: " + userId);
    
    try{
        const client = createClient(url, {
            username: username,
            password: password,
            authType: AuthType.Password
        })

        const exists = await client.exists(`/MedicalDocuments/${userId}`);
        if(!exists) createFolder = true; 

    }catch(error)
    {
        return new Response(JSON.stringify("Failed to check existance"), {status: 400})
    }

    if(createFolder){
        //create the folder before trying to upload
    }
    
    try {
        const file = data.get('file') as unknown as File;

        if (!file) {
            return new Response(JSON.stringify("No file found in the request."), {status: 400});
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const response = await fetch(`${url}/MedicalDocuments/${userId}/${file.name}`, {
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