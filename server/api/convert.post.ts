import convert from 'heic-convert';

export default defineEventHandler(async (event) => {
  const multipart = await readMultipartFormData(event);

  if (!multipart || multipart.length === 0 || !multipart[0].data) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request: No file or empty file uploaded.',
    });
  }

  const heicFile = multipart[0];
  const inputBuffer = heicFile.data;

  try {
    const outputBuffer = await convert({
      buffer: inputBuffer,
      format: 'JPEG',
      quality: 0.9,
    });

    setResponseHeader(event, 'Content-Type', 'image/jpeg');

    if (heicFile.filename) {
      const jpegFilename = heicFile.filename.replace(/\.(heic|heif)$/i, '.jpeg');
      setResponseHeader(event, 'Content-Disposition', `attachment; filename="${jpegFilename}"`);
    }

    return outputBuffer;
  } catch (error) {
    console.error('HEIC to JPEG conversion failed:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Image conversion failed.',
    });
  }
});
