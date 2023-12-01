import { AuthType, createClient, WebDAVClient } from "webdav";
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

export async function GET(req: NextRequest) {
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
        const directoryContents = await client.getDirectoryContents(`/MedicalDocuments/${petId}`);

        const stringified = JSON.stringify(directoryContents);

        const formatted = JSON.parse(stringified) as documents[];

        const downloadLinks = await Promise.all(
            formatted.map(async (element) => {
              const link = await client.getFileDownloadLink(element.filename);
              return { ...element, downloadLink: link };
            })
        );

        return new Response(JSON.stringify(downloadLinks), {status: 200});
    }
    catch(error){
        return new Response(JSON.stringify('Failed to fetch medical documents'), {status: 500});
    }
}