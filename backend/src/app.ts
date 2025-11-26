// Express Application
import  express from "express";
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import { timeStamp } from "console";
import { handleUploadError } from './middleware/upload';
import routes from './routes'

const app = express();

// middleware 
app.use(helmet()) // security headers;
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
}));

app.use(morgan('combined')); // HTTP request logging
app.use(express.json({limit: '10mb'})); // Parse JSON bodies
app.use(express.urlencoded({extended: true, }))

app.get('/api/health' , (req, res) =>{
    res.status(200).json({
        status : 'success', 
        message: 'server is running',
        timeStamp: new Date().toDateString()
    })
})
app.use('/api', routes);

app.use(handleUploadError);

// Global error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);

  // Default error
  let error = { ...err };
  error.message = err.message;

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = { message, statusCode: 404 };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = { message, statusCode: 400 };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val: any) => val.message);
    error = { message: message.join(', '), statusCode: 400 };
  }

  res.status(error.statusCode || 500).json({
    status: 'error',
    message: error.message || 'Internal Server Error'
  });
});

export default app;