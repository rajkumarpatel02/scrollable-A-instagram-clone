// Upload Middleware
import multer from 'multer'
import { Request, Response, NextFunction } from 'express'

const storage = multer.memoryStorage();

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image and video files are allowed!'));
    }
};



// Configure multer
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 50 * 1024 * 1024, // 50MB limit for videos
    },
});


// Middleware for single file upload
export const uploadSingle = upload.single('media');

// Middleware for multiple files (if needed later)
export const uploadMultiple = upload.array('media', 10); // Max 10 files

export const handleUploadError = (error: any, req: Request, res: Response, next: NextFunction) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                status: 'error',
                message: 'File too large, Maximum size 50 MB'
            });

        }
        if (error.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({
                status: 'error',
                message: 'Too many files. Maximum is 10 files.',
            });
        }
        if (error.code === 'LIMIT_UNEXPECTED_FILE') {
            return res.status(400).json({
                status: 'error',
                message: 'Unexpected field name for file upload.',
            });
        }
    }

    if (error && error.message === 'Only image and video files are allowed!') {
        return res.status(400).json({
            status: 'error',
            message: error.message,
        });
    }

    next(error);
};

export default upload;