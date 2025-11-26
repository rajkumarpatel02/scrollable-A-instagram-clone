// Environment Configuration
import { config } from 'dotenv';
import path from 'path';

// Load environment variables from .env file
config({ path: path.join(__dirname, '../../.env') });

interface Environment {
  NODE_ENV: string;
  PORT: number;
  MONGODB_URI: string;
  JWT_SECRET: string;
  JWT_EXPIRE: string;
  CLIENT_URL: string;
  CLOUDINARY_CLOUD_NAME: string;
  CLOUDINARY_API_KEY: string;
  CLOUDINARY_API_SECRET: string;
}

export const env: Environment = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '5000'),
  MONGODB_URI: process.env.MONGODB_URI || '',
  JWT_SECRET: process.env.JWT_SECRET || '',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || '',
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || '',
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || '',
};

// Log loaded environment variables (without secrets)
console.log('🔧 Environment loaded:');
console.log('  NODE_ENV:', env.NODE_ENV);
console.log('  PORT:', env.PORT);
console.log('  MONGODB_URI:', env.MONGODB_URI ? '✓ Set' : '✗ Missing');
console.log('  JWT_SECRET:', env.JWT_SECRET ? '✓ Set' : '✗ Missing');
console.log('  CLOUDINARY_CLOUD_NAME:', env.CLOUDINARY_CLOUD_NAME ? '✓ Set' : '✗ Missing');
console.log('  CLOUDINARY_API_KEY:', env.CLOUDINARY_API_KEY ? '✓ Set' : '✗ Missing');
console.log('  CLOUDINARY_API_SECRET:', env.CLOUDINARY_API_SECRET ? '✓ Set' : '✗ Missing');