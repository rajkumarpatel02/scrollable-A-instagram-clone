import express from 'express';
import { uploadFile } from '../controllers/uploadController';
import { protect } from '../middleware/auth';
import { uploadSingle, handleUploadError } from '../middleware/upload';

const router = express.Router();

// Protected upload route
router.post('/', protect, uploadSingle, uploadFile);

// Error handling for upload
router.use(handleUploadError);

export default router;
