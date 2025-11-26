// Post Types
import { Document, ObjectId} from 'mongoose';
import { IUser} from '../types/user'

export interface IPost extends Document { 
    //  _id: ObjectId;
    user:IUser;
    caption : string;
    mediaUrl: string;
    mediaType : 'image' | 'video';
    likes: ObjectId[];
    comments: IComment[];
    createdAt: Date;
    updatedAt: Date;
    
}

export interface IComment{
    _id: ObjectId;
    user: ObjectId | IUser;
    text : string;
    createdAt : Date;

}

export interface IPostResponse {
    _id: string;
    user: {
        _id: string;
        username: string;
        profilePicture?: string;

    };
    caption: string;
    mediaUrl: string;
    mediaType: 'image' | 'vedio';
    likes: string[];
    comments: ICommentResponse[];
    createdAt: string;
}

export interface ICommentResponse{
    _id: string;
    user: {
        _id : string;
        username: string;
        profilePicture?: string;

    };
    text: string;
    createdAt : string;
}

export type PostCreateInput = {
    capiton : string;
    mediaUrl: string;
    mediaType: 'image' | 'video'
    userId: string;
}