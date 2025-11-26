// Routes Index
import express from 'express';
import authRoutes from './authRoutes';
import postRoutes from './postRoutes';
import uploadRoutes from './uploadRoutes';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/posts', postRoutes);
router.use('/upload', uploadRoutes);

// We'll add more routes here later
// router.use('/users', userRoutes);

export default router;