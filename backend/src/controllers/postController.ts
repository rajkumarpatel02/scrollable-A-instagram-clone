import { Request, Response } from 'express';
import { Post } from '../models';
import { IPostResponse, ICommentResponse } from '../types/post';

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
export const createPost = async (req: Request, res: Response): Promise<void> => {
    try {
        const { caption, mediaUrl, mediaType } = req.body;
        const userId = req.user?._id;

        if (!userId) {
            res.status(401).json({
                status: 'error',
                message: 'User not authenticated',
            });
            return;
        }

        if (!mediaUrl || !mediaType) {
            res.status(400).json({
                status: 'error',
                message: 'Media URL and media type are required',
            });
            return;
        }

        const post = await Post.create({
            user: userId,
            caption: caption || '',
            mediaUrl,
            mediaType,
            likes: [],
            comments: [],
        });

        const populatedPost = await Post.findById(post._id).populate(
            'user',
            'username profilePicture'
        );

        res.status(201).json({
            status: 'success',
            data: {
                post: populatedPost,
            },
        });
    } catch (error: any) {
        console.error('Create post error:', error);
        res.status(500).json({
            status: 'error',
            message: error.message || 'Internal server error',
        });
    }
};

// @desc    Get posts with pagination
// @route   GET /api/posts?page=1&limit=10
// @access  Public
export const getPosts = async (req: Request, res: Response): Promise<void> => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('user', 'username profilePicture')
            .populate('comments.user', 'username profilePicture');

        const total = await Post.countDocuments();
        const hasMore = skip + posts.length < total;

        res.status(200).json({
            status: 'success',
            data: {
                posts,
                pagination: {
                    page,
                    limit,
                    total,
                    hasMore,
                },
            },
        });
    } catch (error: any) {
        console.error('Get posts error:', error);
        res.status(500).json({
            status: 'error',
            message: error.message || 'Internal server error',
        });
    }
};

// @desc    Get single post by ID
// @route   GET /api/posts/:id
// @access  Public
export const getPostById = async (req: Request, res: Response): Promise<void> => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('user', 'username profilePicture')
            .populate('comments.user', 'username profilePicture');

        if (!post) {
            res.status(404).json({
                status: 'error',
                message: 'Post not found',
            });
            return;
        }

        res.status(200).json({
            status: 'success',
            data: {
                post,
            },
        });
    } catch (error: any) {
        console.error('Get post error:', error);
        res.status(500).json({
            status: 'error',
            message: error.message || 'Internal server error',
        });
    }
};

// @desc    Like/unlike a post
// @route   PUT /api/posts/:id/like
// @access  Private
export const likePost = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?._id;
        const postId = req.params.id;

        if (!userId) {
            res.status(401).json({
                status: 'error',
                message: 'User not authenticated',
            });
            return;
        }

        const post = await Post.findById(postId);

        if (!post) {
            res.status(404).json({
                status: 'error',
                message: 'Post not found',
            });
            return;
        }

        const likeIndex = post.likes.indexOf(userId as any);

        if (likeIndex > -1) {
            // Unlike the post
            post.likes.splice(likeIndex, 1);
        } else {
            // Like the post
            post.likes.push(userId as any);
        }

        await post.save();

        const updatedPost = await Post.findById(postId)
            .populate('user', 'username profilePicture')
            .populate('comments.user', 'username profilePicture');

        res.status(200).json({
            status: 'success',
            data: {
                post: updatedPost,
            },
        });
    } catch (error: any) {
        console.error('Like post error:', error);
        res.status(500).json({
            status: 'error',
            message: error.message || 'Internal server error',
        });
    }
};

// @desc    Add comment to a post
// @route   POST /api/posts/:id/comment
// @access  Private
export const addComment = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?._id;
        const postId = req.params.id;
        const { text } = req.body;

        if (!userId) {
            res.status(401).json({
                status: 'error',
                message: 'User not authenticated',
            });
            return;
        }

        if (!text || text.trim() === '') {
            res.status(400).json({
                status: 'error',
                message: 'Comment text is required',
            });
            return;
        }

        const post = await Post.findById(postId);

        if (!post) {
            res.status(404).json({
                status: 'error',
                message: 'Post not found',
            });
            return;
        }

        post.comments.push({
            user: userId as any,
            text: text.trim(),
            createdAt: new Date(),
        } as any);

        await post.save();

        const updatedPost = await Post.findById(postId)
            .populate('user', 'username profilePicture')
            .populate('comments.user', 'username profilePicture');

        res.status(200).json({
            status: 'success',
            data: {
                post: updatedPost,
            },
        });
    } catch (error: any) {
        console.error('Add comment error:', error);
        res.status(500).json({
            status: 'error',
            message: error.message || 'Internal server error',
        });
    }
};

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private
export const deletePost = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?._id;
        const postId = req.params.id;

        if (!userId) {
            res.status(401).json({
                status: 'error',
                message: 'User not authenticated',
            });
            return;
        }

        const post = await Post.findById(postId);

        if (!post) {
            res.status(404).json({
                status: 'error',
                message: 'Post not found',
            });
            return;
        }

        // Check if user owns the post
        if (post.user.toString() !== userId.toString()) {
            res.status(403).json({
                status: 'error',
                message: 'Not authorized to delete this post',
            });
            return;
        }

        await Post.findByIdAndDelete(postId);

        res.status(200).json({
            status: 'success',
            message: 'Post deleted successfully',
        });
    } catch (error: any) {
        console.error('Delete post error:', error);
        res.status(500).json({
            status: 'error',
            message: error.message || 'Internal server error',
        });
    }
};
