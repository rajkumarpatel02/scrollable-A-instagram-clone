import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Post } from '../../services/postService';
import './PostCard.css';

interface PostCardProps {
    post: Post;
    onLike: (postId: string) => void;
    onComment: (postId: string, text: string) => void;
    onDelete: (postId: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onLike, onComment, onDelete }) => {
    const { user } = useAuth();
    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const isLiked = user ? post.likes.includes(user._id) : false;
    const isOwner = user?._id === post.user._id;

    const handleLike = () => {
        onLike(post._id);
    };

    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (commentText.trim()) {
            onComment(post._id, commentText.trim());
            setCommentText('');
        }
    };

    const handleDelete = () => {
        onDelete(post._id);
        setShowDeleteConfirm(false);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 7) {
            return date.toLocaleDateString();
        } else if (days > 0) {
            return `${days}d ago`;
        } else if (hours > 0) {
            return `${hours}h ago`;
        } else if (minutes > 0) {
            return `${minutes}m ago`;
        } else {
            return 'Just now';
        }
    };

    return (
        <div className="post-card">
            <div className="post-header">
                <div className="post-user-info">
                    {post.user.profilePicture ? (
                        <img
                            src={post.user.profilePicture}
                            alt={post.user.username}
                            className="post-user-avatar"
                        />
                    ) : (
                        <div className="post-user-avatar-placeholder">
                            {post.user.username[0].toUpperCase()}
                        </div>
                    )}
                    <span className="post-username">{post.user.username}</span>
                </div>
                {isOwner && (
                    <button
                        className="post-delete-button"
                        onClick={() => setShowDeleteConfirm(true)}
                    >
                        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                        </svg>
                    </button>
                )}
            </div>

            <div className="post-media">
                {post.mediaType === 'video' ? (
                    <video src={post.mediaUrl} controls className="post-video" />
                ) : (
                    <img src={post.mediaUrl} alt="Post" className="post-image" />
                )}
            </div>

            <div className="post-actions">
                <button
                    className={`action-button ${isLiked ? 'liked' : ''}`}
                    onClick={handleLike}
                >
                    <svg width="24" height="24" fill={isLiked ? '#ed4956' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                </button>
                <button
                    className="action-button"
                    onClick={() => setShowComments(!showComments)}
                >
                    <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                </button>
            </div>

            <div className="post-info">
                <div className="post-likes">
                    {post.likes.length} {post.likes.length === 1 ? 'like' : 'likes'}
                </div>
                {post.caption && (
                    <div className="post-caption">
                        <span className="caption-username">{post.user.username}</span> {post.caption}
                    </div>
                )}
                <div className="post-date">{formatDate(post.createdAt)}</div>
            </div>

            {showComments && (
                <div className="post-comments">
                    <div className="comments-list">
                        {post.comments.length === 0 ? (
                            <p className="no-comments">No comments yet</p>
                        ) : (
                            post.comments.map((comment) => (
                                <div key={comment._id} className="comment">
                                    <span className="comment-username">{comment.user.username}</span>
                                    <span className="comment-text">{comment.text}</span>
                                    <span className="comment-date">{formatDate(comment.createdAt)}</span>
                                </div>
                            ))
                        )}
                    </div>
                    <form onSubmit={handleCommentSubmit} className="comment-form">
                        <input
                            type="text"
                            placeholder="Add a comment..."
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            className="comment-input"
                            maxLength={500}
                        />
                        <button
                            type="submit"
                            className="comment-submit"
                            disabled={!commentText.trim()}
                        >
                            Post
                        </button>
                    </form>
                </div>
            )}

            {showDeleteConfirm && (
                <div className="delete-modal">
                    <div className="delete-modal-content">
                        <h3>Delete Post?</h3>
                        <p>Are you sure you want to delete this post?</p>
                        <div className="delete-modal-actions">
                            <button onClick={() => setShowDeleteConfirm(false)} className="cancel-delete">
                                Cancel
                            </button>
                            <button onClick={handleDelete} className="confirm-delete">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PostCard;
