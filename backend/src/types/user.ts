// User Types
import { Document } from "mongoose";

export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    profilePicture?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IUserResponse {
    _id: string;
    username: string;
    email: string;
    profilePicture?: string;
    createdAt: string;
}

export type UserCreateInput = Omit<IUser, '_id' | 'createdAt' | 'updatedAt'>;