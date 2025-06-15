import convert from 'heic-convert';

export default defineEventHandler(async (event) => {
  // Read the raw request body, which should be the HEIC file buffer
  const inputBuffer = await readRawBody(event, false);
  console.log(inputBuffer);
  const blob = new Blob([inputBuffer]);
  console.log(blob);
  const arrayBuffer = await blob.arrayBuffer();
  if (!inputBuffer || inputBuffer.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request: No image data received.',
    });
  }

  try {
    const outputBuffer = await convert({
      buffer: inputBuffer,
      format: 'JPEG',
      quality: 0.9,
    });

    setResponseHeader(event, 'Content-Type', 'image/jpeg');
    setResponseHeader(event, 'Content-Disposition', 'inline; filename="converted.jpeg"');

    return outputBuffer;
  } catch (error) {
    console.error('HEIC to JPEG conversion failed:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Image conversion failed.',
    });
  }
});
