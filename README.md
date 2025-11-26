# Scrollable - Instagram Clone

A mini Instagram-like application with scrollable feed features.

## Project Structure

```
├── backend/          # Node.js + Express + TypeScript backend
├── frontend/         # React + Vite + TypeScript frontend
├── shared/           # Shared types between frontend and backend
└── package.json      # Root package.json for workspace management
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB (for backend database)

### Installation

All dependencies have been installed. If you need to reinstall:

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Running the Application

#### Backend
```bash
cd backend
npm run dev
```
The backend will run on `http://localhost:5000`

#### Frontend
```bash
cd frontend
npm run dev
```
The frontend will run on `http://localhost:3000`

### Environment Variables

#### Backend (.env)
- `PORT` - Server port (default: 5000)
- `DATABASE_URL` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret

#### Frontend (.env)
- `VITE_API_URL` - Backend API URL (default: http://localhost:5000/api)

## Features (To Be Implemented)

- User authentication (login/register)
- Infinite scroll feed
- Post creation with image upload
- User profiles
- Like and comment functionality

## Tech Stack

### Backend
- Node.js
- Express.js
- TypeScript
- MongoDB (Mongoose)
- JWT Authentication
- Cloudinary (Image hosting)
- Multer (File upload)

### Frontend
- React 18
- TypeScript
- Vite
- React Router
- Axios
- CSS Modules

## Development

The project structure is ready for development. All blank files and folders have been created according to the specified structure.
