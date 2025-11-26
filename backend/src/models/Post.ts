import mongoose, { Schema } from 'mongoose';
import { IPost, IComment } from '../types/post';

const commentSchema = new Schema<IComment>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        text: {
            type: String,
            required: [true, 'Comment text is required'],
            trim: true,
            maxlength: [500, 'Comment cannot exceed 500 characters'],
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    { _id: true }
);

const postSchema = new Schema<IPost>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        caption: {
            type: String,
            trim: true,
            maxlength: [2200, 'Caption cannot exceed 2200 characters'],
        },
        mediaUrl: {
            type: String,
            required: [true, 'Media URL is required'],
        },
        mediaType: {
            type: String,
            enum: ['image', 'video'],
            required: [true, 'Media type is required'],
        },
        likes: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        comments: [commentSchema],
    },
    {
        timestamps: true,
    }
);

// Indexes for better query performance
postSchema.index({ user: 1, createdAt: -1 });
postSchema.index({ createdAt: -1 });

const Post = mongoose.model<IPost>('Post', postSchema);

export default Post;
