import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models';
import { ILoginRequest, IRegisterRequest, IAuthResponse } from '../types/auth';
import { env } from '../config/env';

// Generate JWT Token
const generateToken = (userId: string): string => {
  return jwt.sign(
    { id: userId },
    env.JWT_SECRET as string,
    { expiresIn: env.JWT_EXPIRE as string }
  );
};

// Send token response
const sendTokenResponse = (user: any, statusCode: number, res: Response): void => {
  const token = generateToken(user._id);

  const response: IAuthResponse = {
      user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          profilePicture: user.profilePicture,
      },
      token,
      message: ''
  };

  res.status(statusCode).json({
    status: 'success',
    data: response,
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (
  req: Request<{}, {}, IRegisterRequest>,
  res: Response
): Promise<void> => {
  try {
    const { username, email, password, profilePicture } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      res.status(400).json({
        status: 'error',
        message: 'User with this email or username already exists',
      });
      return;
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password,
      profilePicture,
    });

    sendTokenResponse(user, 201, res);
  } catch (error: any) {
    console.error('Register error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Internal server error',
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (
  req: Request<{}, {}, ILoginRequest>,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validate email and password
    if (!email || !password) {
      res.status(400).json({
        status: 'error',
        message: 'Please provide email and password',
      });
      return;
    }

    // Check if user exists and password is correct
    // Use select('+password') to include the password field
    const user: any = await User.findOne({ email }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      res.status(401).json({
        status: 'error',
        message: 'Invalid email or password',
      });
      return;
    }

    sendTokenResponse(user, 200, res);
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Internal server error',
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    // req.user is set by the auth middleware (we'll create this next)
    const user = await User.findById(req.user?._id);

    if (!user) {
      res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
      return;
    }

    res.status(200).json({
      status: 'success',
      data: {
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          profilePicture: user.profilePicture,
          createdAt: user.createdAt,
        },
      },
    });
  } catch (error: any) {
    console.error('Get me error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Internal server error',
    });
  }
};