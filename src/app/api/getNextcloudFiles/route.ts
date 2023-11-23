import { NextApiRequest, NextApiResponse } from 'next';

export const config = {
    api: {
        bodyParser: false
    }
};

export async function POST(req: NextApiRequest, res: NextApiResponse) {
    try {
        const data = await (req as any).formData();
        const file = data.get('file') as unknown as File;

        if (!file) {
            return new Response("No file found in the request.");
        }

        const username = process.env.NEXTCLOUD_USERNAME
        const password = process.env.NEXTCLOUD_PASSWORD
        const url = process.env.NEXTCLOUD_URL

        if(!username || !password || !url)
        {
            return new Response("Env credentials failed");
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const response = await fetch(url + '/' + file.name, {
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
        return new Response("Error: " + error)
    }
}