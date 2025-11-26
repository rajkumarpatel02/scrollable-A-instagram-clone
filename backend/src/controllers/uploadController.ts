import { Request, Response } from 'express';
import cloudinary from '../config/cloudinary';
import { Readable } from 'stream';

// Upload controller
export const uploadFile = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.file) {
            res.status(400).json({
                status: 'error',
                message: 'No file uploaded',
            });
            return;
        }

        const file = req.file;
        const isVideo = file.mimetype.startsWith('video/');

        // Convert buffer to stream
        const bufferStream = new Readable();
        bufferStream.push(file.buffer);
        bufferStream.push(null);

        // Upload to Cloudinary
        const uploadPromise = new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    resource_type: isVideo ? 'video' : 'image',
                    folder: 'scrollable',
                    transformation: isVideo
                        ? [{ quality: 'auto' }]
                        : [{ width: 1080, height: 1080, crop: 'limit', quality: 'auto' }],
                },
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                }
            );

            bufferStream.pipe(uploadStream);
        });

        const result: any = await uploadPromise;

        res.status(200).json({
            status: 'success',
            data: {
                url: result.secure_url,
                type: isVideo ? 'video' : 'image',
                publicId: result.public_id,
            },
        });
    } catch (error: any) {
        console.error('Upload error:', error);
        res.status(500).json({
            status: 'error',
            message: error.message || 'Failed to upload file',
        });
    }
};
