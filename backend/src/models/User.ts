import mongoose, { Schema, Document } from 'mongoose';
import { NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { IUser } from '../types/user';

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters'],
      maxlength: [30, 'Username cannot exceed 30 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Don't include password in queries by default
    },
    profilePicture: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// Index for better query performance
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });

// Pre-save middleware to hash password before saving
userSchema.pre<IUser>('save', async function (next) {
  // Only hash the password if it's modified (or new)
  if (!this.isModified('password')) {
    return next();
  }

  try {
    // Generate salt
    const salt = await bcrypt.genSalt(12);
    // Hash password
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to check if password matches
userSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to get user data without sensitive information
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

// Static method to check if email is taken
userSchema.statics.isEmailTaken = async function (email: string, excludeUserId?: string): Promise<boolean> {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

// Static method to check if username is taken
userSchema.statics.isUsernameTaken = async function (username: string, excludeUserId?: string): Promise<boolean> {
  const user = await this.findOne({ username, _id: { $ne: excludeUserId } });
  return !!user;
};

// Add the static methods to the schema
interface UserModel extends mongoose.Model<IUser> {
  isEmailTaken(email: string, excludeUserId?: string): Promise<boolean>;
  isUsernameTaken(username: string, excludeUserId?: string): Promise<boolean>;
}

const User = mongoose.model<IUser, UserModel>('User', userSchema);

export default User;