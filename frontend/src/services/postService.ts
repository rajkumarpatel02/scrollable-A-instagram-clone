import api from './api';

export interface Post {
    _id: string;
    user: {
        _id: string;
        username: string;
        profilePicture?: string;
    };
    caption: string;
    mediaUrl: string;
    mediaType: 'image' | 'video';
    likes: string[];
    comments: Comment[];
    createdAt: string;
    updatedAt: string;
}

export interface Comment {
    _id: string;
    user: {
        _id: string;
        username: string;
        profilePicture?: string;
    };
    text: string;
    createdAt: string;
}

export interface CreatePostData {
    caption: string;
    mediaUrl: string;
    mediaType: 'image' | 'video';
}

export interface PaginationResponse {
    posts: Post[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        hasMore: boolean;
    };
}

const postService = {
    // Get posts with pagination
    getPosts: async (page: number = 1, limit: number = 10): Promise<PaginationResponse> => {
        const response = await api.get(`/posts?page=${page}&limit=${limit}`);
        return response.data.data;
    },

    // Get single post
    getPost: async (id: string): Promise<Post> => {
        const response = await api.get(`/posts/${id}`);
        return response.data.data.post;
    },

    // Create new post
    createPost: async (data: CreatePostData): Promise<Post> => {
        const response = await api.post('/posts', data);
        return response.data.data.post;
    },

    // Like/unlike post
    likePost: async (id: string): Promise<Post> => {
        const response = await api.put(`/posts/${id}/like`);
        return response.data.data.post;
    },

    // Add comment to post
    addComment: async (id: string, text: string): Promise<Post> => {
        const response = await api.post(`/posts/${id}/comment`, { text });
        return response.data.data.post;
    },

    // Delete post
    deletePost: async (id: string): Promise<void> => {
        await api.delete(`/posts/${id}`);
    },
};

export default postService;
