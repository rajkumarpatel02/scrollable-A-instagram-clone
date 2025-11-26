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

const getEnvVariable = (key: keyof Environment): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`❌ Environment variable ${key} is not set`);
  }
  return value;
};

export const env: Environment = {
  NODE_ENV: getEnvVariable('NODE_ENV') || 'development',
  PORT: parseInt(getEnvVariable('PORT')) || 5000,
  MONGODB_URI: getEnvVariable('MONGODB_URI'),
  JWT_SECRET: getEnvVariable('JWT_SECRET'),
  JWT_EXPIRE: getEnvVariable('JWT_EXPIRE'),
  CLIENT_URL: getEnvVariable('CLIENT_URL'),
  CLOUDINARY_CLOUD_NAME: getEnvVariable('CLOUDINARY_CLOUD_NAME'),
  CLOUDINARY_API_KEY: getEnvVariable('CLOUDINARY_API_KEY'),
  CLOUDINARY_API_SECRET: getEnvVariable('CLOUDINARY_API_SECRET'),
};

// Validate required environment variables in production
if (env.NODE_ENV === 'production') {
  const required = ['MONGODB_URI', 'JWT_SECRET', 'CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'];
  required.forEach(key => {
    if (!process.env[key]) {
      throw new Error(`❌ Required environment variable ${key} is missing in production`);
    }
  });
}