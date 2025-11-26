import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import uploadService from '../../services/uploadService';
import postService from '../../services/postService';
import './Upload.css';

const Upload: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string>('');
    const [caption, setCaption] = useState('');
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm'];
        if (!validTypes.includes(selectedFile.type)) {
            setError('Please select a valid image or video file');
            return;
        }

        // Validate file size (max 50MB)
        if (selectedFile.size > 50 * 1024 * 1024) {
            setError('File size must be less than 50MB');
            return;
        }

        setFile(selectedFile);
        setError('');

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(selectedFile);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!file) {
            setError('Please select a file');
            return;
        }

        setUploading(true);
        setError('');

        try {
            // Upload file to Cloudinary
            const uploadResponse = await uploadService.uploadFile(file);

            // Create post
            await postService.createPost({
                caption,
                mediaUrl: uploadResponse.url,
                mediaType: uploadResponse.type,
            });

            // Redirect to home
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to upload post');
        } finally {
            setUploading(false);
        }
    };

    const handleCancel = () => {
        setFile(null);
        setPreview('');
        setCaption('');
        setError('');
    };

    return (
        <div className="upload-container">
            <div className="upload-card">
                <h2 className="upload-title">Create New Post</h2>

                {error && <div className="upload-error">{error}</div>}

                <form onSubmit={handleSubmit} className="upload-form">
                    {!preview ? (
                        <div className="file-input-container">
                            <label htmlFor="file-input" className="file-input-label">
                                <div className="file-input-content">
                                    <svg
                                        className="upload-icon"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                        />
                                    </svg>
                                    <p className="file-input-text">Click to select photo or video</p>
                                    <p className="file-input-subtext">or drag and drop</p>
                                </div>
                            </label>
                            <input
                                id="file-input"
                                type="file"
                                accept="image/*,video/*"
                                onChange={handleFileChange}
                                className="file-input-hidden"
                                disabled={uploading}
                            />
                        </div>
                    ) : (
                        <div className="preview-container">
                            {file?.type.startsWith('video/') ? (
                                <video src={preview} controls className="preview-media" />
                            ) : (
                                <img src={preview} alt="Preview" className="preview-media" />
                            )}
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="change-file-button"
                                disabled={uploading}
                            >
                                Change File
                            </button>
                        </div>
                    )}

                    {preview && (
                        <>
                            <div className="caption-container">
                                <textarea
                                    placeholder="Write a caption..."
                                    value={caption}
                                    onChange={(e) => setCaption(e.target.value)}
                                    className="caption-input"
                                    rows={4}
                                    maxLength={2200}
                                    disabled={uploading}
                                />
                                <div className="caption-counter">
                                    {caption.length}/2200
                                </div>
                            </div>

                            <div className="upload-actions">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="cancel-button"
                                    disabled={uploading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="submit-button"
                                    disabled={uploading}
                                >
                                    {uploading ? 'Uploading...' : 'Share'}
                                </button>
                            </div>
                        </>
                    )}
                </form>
            </div>
        </div>
    );
};

export default Upload;
