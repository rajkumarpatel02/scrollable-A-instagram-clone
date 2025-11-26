import api from './api';

export interface UploadResponse {
    url: string;
    type: 'image' | 'video';
}

const uploadService = {
    // Upload file to Cloudinary
    uploadFile: async (file: File): Promise<UploadResponse> => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await api.post('/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data.data;
    },
};

export default uploadService;
