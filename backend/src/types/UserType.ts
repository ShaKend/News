export interface UserType {
    user_id: string,
    email: string,
    username: string,
    auth_provider: string,
    password: string,
    profile_picture: string,
    created_at: Date | string,
    updated_at: Date | string,
};