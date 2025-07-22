import { supabase } from "../utils/SupabaseClient";
import { FavoriteType } from "../types/FavoriteType";

const TABLE_NAME = "ms_favorites_news";

export const getAllFavorites = async (userId: string): Promise<FavoriteType[]> => {
    if (!userId) {
        throw new Error("Missing required parameter: userId");
    }

    const { data, error } = await supabase
        .from(TABLE_NAME)
        .select('*')
        .eq('user_id', userId);

    if (error) {
        throw new Error(`Failed to fetch favorites: ${error.message}. If the error is undefinded, check the table name and the column names.`);
    }

    return data as FavoriteType[];
};

export const getOneFavorite = async (userId: string, articleUrl: string): Promise<FavoriteType | null> => {
    if (!userId || !articleUrl) {
        throw new Error("Missing required parameters: userId or articleUrl");
    }

    const { data, error } = await supabase
        .from(TABLE_NAME)
        .select('*')
        .eq('user_id', userId)
        .eq('article_url', articleUrl)
        .maybeSingle();

    if (error) {
        throw new Error(`Failed to fetch favorite: ${error.message}. If the error is undefinded, check the table name and the column names.`);
    }

    return data as FavoriteType | null;
};

export const addFavorite = async (favorite: FavoriteType): Promise<FavoriteType> => {
    if(!favorite.user_id) {
        throw new Error("Missing user_id");
    }
    if(!favorite.article_url) {
        throw new Error("Missing article_url");
    }
    if(!favorite.title) {
        throw new Error("Missing title");
    }
    if(!favorite.description) {
        throw new Error("Missing description");
    }
    if(!favorite.content) {
        throw new Error("Missing content");
    }
    if(!favorite.author) {
        throw new Error("Missing author");
    }
    if(!favorite.source_name) {
        throw new Error("Missing source_name");
    }
    if(!favorite.image_url) {
        throw new Error("Missing image_url");
    }
    if (!favorite.published_at) {
        throw new Error("Missing published_at");
    }

    favorite.liked_at = new Date().toISOString();

    const { data, error } = await supabase
        .from(TABLE_NAME)
        .insert([favorite])
        .select()
        .single();  

    if (error) {
        throw new Error(`Failed to add favorite: ${error.message}. If the error is undefinded, check the table name and the column names.`);
    }

    return data as FavoriteType;
};

export const deleteFavorite = async (userId: string, articleUrl: string): Promise<void> => {
    if (!userId || !articleUrl) {
        throw new Error("Missing required parameters: userId or articleUrl");
    }

    const { error } = await supabase
        .from(TABLE_NAME)
        .delete()
        .eq('user_id', userId)
        .eq('article_url', articleUrl);

    if (error) {
        throw new Error(`Failed to delete favorite: ${error.message}. If the error is undefinded, check the table name and the column names.`);
    }
};   

