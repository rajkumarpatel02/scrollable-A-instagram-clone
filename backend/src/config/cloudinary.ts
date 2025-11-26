// Cloudinary Configuration
import { v2 as cloudinary } from 'cloudinary';
import { env } from './env';

// Configure Cloudinary
console.log('🔧 Configuring Cloudinary with:');
console.log('  cloud_name:', env.CLOUDINARY_CLOUD_NAME || '(empty)');
console.log('  api_key:', env.CLOUDINARY_API_KEY || '(empty)');
console.log('  api_secret:', env.CLOUDINARY_API_SECRET ? '***' + env.CLOUDINARY_API_SECRET.slice(-4) : '(empty)');

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

// Types for Cloudinary upload response
export interface CloudinaryUploadResult {
  public_id: string;
  version: number;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: 'image' | 'video';
  created_at: string;
  tags: string[];
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  original_filename: string;
}

// Upload file to Cloudinary
export const uploadToCloudinary = (
  file: Express.Multer.File,
  folder: string = 'instagram-clone'
): Promise<CloudinaryUploadResult> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'auto', // Auto-detect image or video
        folder: folder,
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'mp4', 'mov', 'avi'],
        transformation: [
          { quality: 'auto', fetch_format: 'auto' } // Optimize file size and format
        ]
      },
      (error, result) => {
        if (error) {
          reject(new Error(`Cloudinary upload failed: ${error.message}`));
        } else if (result) {
          resolve(result as CloudinaryUploadResult);
        } else {
          reject(new Error('Cloudinary upload returned no result'));
        }
      }
    );

    uploadStream.end(file.buffer);
  });
};

// Delete file from Cloudinary
export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Error deleting file from Cloudinary:', error);
    throw new Error('Failed to delete file from Cloudinary');
  }
};

export default cloudinary;