import { supabase } from "../utils/SupabaseClient";
import { UserType } from "../types/UserType";
import bcrypt from "bcryptjs";

const TABLE_NAME = "ms_user_news";
const date = new Date();

export const getUserById = async (userId: string): Promise<UserType | null> => {
    if (!userId) {
        throw new Error("Missing required parameter: userId");
    }   
    const { data, error } = await supabase
        .from(TABLE_NAME)
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
    if (error) {    
        throw new Error(`Failed to fetch user: ${error.message}`);
    }
    return data as UserType | null;
};  

export const getUserByEmail = async (email: string): Promise<UserType | null> => {
    if (!email) {
        throw new Error("Missing required parameter: email");
    }
    if (typeof email !== 'string' || !email.includes('@') || !email.includes('.')) {
        throw new Error("Invalid email format");
    }
    const { data, error } = await supabase
        .from(TABLE_NAME)
        .select('*')
        .eq('email', email)
        .maybeSingle();
    if (error) {
        throw new Error(`Failed to fetch user: ${error.message}`);
    }
    return data as UserType | null; 
};

export const createUser = async (user: UserType): Promise<UserType> => {
    if (!user.email || !user.username || !user.auth_provider) {
        throw new Error("Missing required user fields: email, username, auth_provider");
    }

    if (user.password && user.password.length < 5) {
        throw new Error("Password must be at least 5 characters long");
    }

    if (user.auth_provider !== 'manual' && user.auth_provider != 'google') {
        throw new Error("Invalid auth_provider. Must be 'manual' or 'google'.");
    }

    // Hash password if auth_provider is manual
    if (user.auth_provider === 'manual' && user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
    }

    user.created_at = date.toISOString();

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert([user])
      .select()
      .single();    
    if (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }

  return data;
};

export const login = async (email: string, password: string): Promise<UserType | null> => {
    if (!email || !password) {
        throw new Error("Missing required fields: email, password");
    }

    const user = await getUserByEmail(email);
    if (!user) {
        throw new Error("User not found");
    }

    if (user.auth_provider !== 'manual') {
        throw new Error("User is not registered with manual authentication");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error("Invalid password");
    }

    return user;
};

export const updateUser = async (userId: string, updates: Partial<UserType>): Promise<UserType | null> => {
    if (!userId) {
        throw new Error("Missing required parameter: userId");
    }

    if (updates.password) {
        if (updates.password.length < 5) {
            throw new Error("Password must be at least 5 characters long");
        }
        const salt = await bcrypt.genSalt(10);
        updates.password = await bcrypt.hash(updates.password, salt);

        if(updates.auth_provider === 'google') {
            updates.auth_provider = 'hybrid'; // Change auth_provider to hybrid if password is updated
        }
    }

    if (updates.username && updates.username.length < 3 && updates.username !== '') {
        throw new Error("Username must be at least 3 characters long or not empty");
    }

    updates.updated_at = date.toISOString();

    const { data, error } = await supabase
        .from(TABLE_NAME)
        .update(updates)
        .eq('user_id', userId)
        .select()
        .single();
    
    if (error) {
        throw new Error(`Failed to update user: ${error.message}`);
    }

    return data as UserType | null;
};