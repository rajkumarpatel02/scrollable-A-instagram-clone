// Routes Index
import express from 'express';
import authRoutes from './authRoutes';

const router = express.Router();

router.use('/auth', authRoutes);

// We'll add more routes here later
// router.use('/posts', postRoutes);
// router.use('/users', userRoutes);

export default router;