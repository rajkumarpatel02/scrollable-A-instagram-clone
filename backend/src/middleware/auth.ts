// Auth Middleware
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models';
import { env } from '../config/env';
import { IUser } from '../types/user';

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

interface JwtPayload {
  id: string;
  iat: number;
  exp: number;
}

// @desc    Protect routes - verify JWT token
// @access  Private
export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists
    if (!token) {
      res.status(401).json({
        status: 'error',
        message: 'Not authorized to access this route. No token provided.',
      });
      return;
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;

      // Get user from the token
      const user = await User.findById(decoded.id);

      if (!user) {
        res.status(401).json({
          status: 'error',
          message: 'Not authorized to access this route. User not found.',
        });
        return;
      }

      // Add user to request object
      req.user = user;
      next();
    } catch (error) {
      res.status(401).json({
        status: 'error',
        message: 'Not authorized to access this route. Invalid token.',
      });
      return;
    }
  } catch (error: any) {
    console.error('Auth middleware error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
};

// @desc    Optional auth middleware - sets user if token exists, but doesn't require it
// @access  Public (optional auth)
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      try {
        // Verify token
        const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;

        // Get user from the token
        const user = await User.findById(decoded.id);

        if (user) {
          // Add user to request object if token is valid
          req.user = user;
        }
      } catch (error) {
        // If token is invalid, just continue without user
        console.log('Optional auth: Invalid token, continuing without user');
      }
    }

    next();
  } catch (error: any) {
    console.error('Optional auth middleware error:', error);
    // Even if there's an error, we continue without authentication
    next();
  }
};