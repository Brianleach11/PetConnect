import { NextRequest, NextResponse } from "next/server";
import {createClient, AuthType } from "webdav"

export async function GET()
{
    const username = 'bleac002@fiu.edu';  // Should be from environment variables
    const password = 'PetConnect';        // Should be from environment variables
    const url = 'https://cc2.cs.fiu.edu/remote.php/dav/files/bleac002';

    try{
        console.log("before client")
        const client = createClient(url, {
            username: username,
            password: password,
            authType: AuthType.Password
        })
        console.log("after client")
        const directoryItems = await client.getDirectoryContents('/PetConnect/MedicalDocuments');
        console.log("Directory items: " + directoryItems);
    }
    catch(error)
    {
        console.log(error);
    }
}