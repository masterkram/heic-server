import convert from 'heic-convert';
import fs from 'fs';

export default defineEventHandler(async (event) => {
  const inputBuffer = fs.readFileSync('./server/assets/test.heic');
  if (!inputBuffer) {
    throw createError({
      statusCode: 404,
      statusMessage: 'File not found: test.heic not found in server/assets folder.',
    });
  }

  $fetch('/api/convert', {
    method: 'POST',
    body: inputBuffer,
  })
}); 