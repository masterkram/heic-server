import fs from 'fs';
import path from 'path';

export default defineEventHandler(async (event) => {
  const filePath = path.resolve(process.cwd(), './server/assets/test.heic');

  if (!fs.existsSync(filePath)) {
    throw createError({
      statusCode: 404,
      statusMessage: 'File not found: test.heic not found at ' + filePath,
    });
  }

  const inputBuffer = fs.readFileSync(filePath);
  console.log(inputBuffer);

  try {
    // Use $fetch.raw to get the full response, including headers
    const convertedResponse = await $fetch.raw('/api/convert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/octet-stream'
      },
      body: inputBuffer,
    });

    // Proxy the headers from the conversion endpoint to the client
    for (const [key, value] of convertedResponse.headers.entries()) {
      if (key.toLowerCase() === 'content-type' || key.toLowerCase() === 'content-disposition') {
        setResponseHeader(event, key, value);
      }
    }

    // Return the converted image data
    return convertedResponse._data;
  } catch (error: any) {
    console.error('Failed to fetch from /api/convert:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Failed to convert image via internal API.',
    });
  }
}); 