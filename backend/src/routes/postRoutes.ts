import express from 'express';
import {
    createPost,
    getPosts,
    getPostById,
    likePost,
    addComment,
    deletePost,
} from '../controllers/postController';
import { protect } from '../middleware/auth';

const router = express.Router();

// Public routes
router.get('/', getPosts);
router.get('/:id', getPostById);

// Protected routes
router.post('/', protect, createPost);
router.put('/:id/like', protect, likePost);
router.post('/:id/comment', protect, addComment);
router.delete('/:id', protect, deletePost);

export default router;
