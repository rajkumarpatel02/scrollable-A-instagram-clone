import React, { useState, useEffect, useRef, useCallback } from 'react';
import postService, { Post } from '../../services/postService';
import PostCard from '../../components/feed/PostCard';
import './Home.css';

const Home: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const observerTarget = useRef<HTMLDivElement>(null);

    const loadPosts = useCallback(async (pageNum: number) => {
        if (loading) return;

        setLoading(true);
        setError('');

        try {
            const response = await postService.getPosts(pageNum, 10);

            if (pageNum === 1) {
                setPosts(response.posts);
            } else {
                setPosts((prev) => [...prev, ...response.posts]);
            }

            setHasMore(response.pagination.hasMore);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to load posts');
        } finally {
            setLoading(false);
        }
    }, [loading]);

    useEffect(() => {
        loadPosts(1);
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !loading) {
                    setPage((prev) => prev + 1);
                }
            },
            { threshold: 0.1 }
        );

        const currentTarget = observerTarget.current;
        if (currentTarget) {
            observer.observe(currentTarget);
        }

        return () => {
            if (currentTarget) {
                observer.unobserve(currentTarget);
            }
        };
    }, [hasMore, loading]);

    useEffect(() => {
        if (page > 1) {
            loadPosts(page);
        }
    }, [page]);

    const handleLike = async (postId: string) => {
        try {
            const updatedPost = await postService.likePost(postId);
            setPosts((prev) =>
                prev.map((post) => (post._id === postId ? updatedPost : post))
            );
        } catch (err: any) {
            console.error('Failed to like post:', err);
        }
    };

    const handleComment = async (postId: string, text: string) => {
        try {
            const updatedPost = await postService.addComment(postId, text);
            setPosts((prev) =>
                prev.map((post) => (post._id === postId ? updatedPost : post))
            );
        } catch (err: any) {
            console.error('Failed to add comment:', err);
        }
    };

    const handleDelete = async (postId: string) => {
        try {
            await postService.deletePost(postId);
            setPosts((prev) => prev.filter((post) => post._id !== postId));
        } catch (err: any) {
            console.error('Failed to delete post:', err);
        }
    };

    return (
        <div className="home-container">
            <div className="feed-container">
                {error && <div className="error-message">{error}</div>}

                {posts.length === 0 && !loading && (
                    <div className="empty-state">
                        <h2>No posts yet</h2>
                        <p>Start following people or create your first post!</p>
                    </div>
                )}

                <div className="posts-grid">
                    {posts.map((post) => (
                        <PostCard
                            key={post._id}
                            post={post}
                            onLike={handleLike}
                            onComment={handleComment}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>

                {hasMore && (
                    <div ref={observerTarget} className="loading-trigger">
                        {loading && (
                            <div className="loading-spinner">
                                <div className="spinner"></div>
                            </div>
                        )}
                    </div>
                )}

                {!hasMore && posts.length > 0 && (
                    <div className="end-message">
                        <p>You've reached the end!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
