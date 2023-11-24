import { NextApiRequest } from "next";
import {createClient, AuthType } from "webdav"

export async function GET()//request: NextApiRequest)
{
    console.log("INSIDE GET")
    //const {folder, id} = request.query;
    const folder = "MedicalDocuments"
    const id = "aad3"
    const username = process.env.NEXTCLOUD_USERNAME;  
    const password = process.env.NEXTCLOUD_USERNAME;   
    const url = process.env.NEXTCLOUD_URL;

    console.log("FOLDER " + folder + " id " + id);

    if(!username || !password || !url)
    {
        return new Response(JSON.stringify(false), {status: 401});
    }

    try{
        const client = createClient(url, {
            username: username,
            password: password,
            authType: AuthType.Password
        })
        const exists = await client.exists(`/${folder}/${id}`);
        console.log("EXISTS: " + exists)
        return new Response(JSON.stringify(exists), {status: 201});
    }
    catch(error)
    {
        console.log(error);
        return new Response(JSON.stringify(false), {status: 501});
    }
}