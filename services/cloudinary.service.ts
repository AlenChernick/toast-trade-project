import 'server-only';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

const cloudName = process.env.CLOUDINARY_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

export const uploadToCloudinary = async (buffer: ArrayBuffer) => {
  try {
    const bufferData = Buffer.from(buffer);
    const bufferStream = new Readable();
    bufferStream.push(bufferData);
    bufferStream.push(null);

    const uploadedImage = await new Promise<string>((resolve, reject) => {
      bufferStream.pipe(
        cloudinary.uploader.upload_stream(
          { folder: 'toast-trade', resource_type: 'image' },
          (error, result) => {
            if (error) {
              console.error('Error uploading image to Cloudinary:', error);
              reject(new Error('Error uploading image to Cloudinary'));
            } else {
              if (result) {
                resolve(result.secure_url);
              } else {
                reject(new Error('Result object is undefined'));
              }
            }
          }
        )
      );
    });

    return uploadedImage;
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    throw new Error('Error uploading image to Cloudinary');
  }
};
