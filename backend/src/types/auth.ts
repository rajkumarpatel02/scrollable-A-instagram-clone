// Auth Types
export interface ILoginRequest {
    email: string;
    password: string;

}

export interface IRegisterRequest {
    username : string;
    email : string ;
    password : string;
    profilePicture?: string;
    
}

export interface IAuthResponse {
    user: {
        _id: string;
        username : string;
        email: string;
        profilePicture?: string;
    };
    token: string;
    message: string;
}