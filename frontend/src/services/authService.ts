import api from './api';

export interface LoginData {
    email: string;
    password: string;
}

export interface RegisterData {
    username: string;
    email: string;
    password: string;
    profilePicture?: string;
}

export interface User {
    _id: string;
    username: string;
    email: string;
    profilePicture?: string;
    createdAt?: string;
}

export interface AuthResponse {
    user: User;
    token: string;
}

const authService = {
    // Register new user
    register: async (data: RegisterData): Promise<AuthResponse> => {
        const response = await api.post('/auth/register', data);
        return response.data.data;
    },

    // Login user
    login: async (data: LoginData): Promise<AuthResponse> => {
        const response = await api.post('/auth/login', data);
        return response.data.data;
    },

    // Get current user
    getMe: async (): Promise<User> => {
        const response = await api.get('/auth/me');
        return response.data.data.user;
    },

    // Logout user
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },
};

export default authService;
