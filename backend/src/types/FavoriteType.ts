export interface FavoriteType {
    user_id: string; // UUID
    article_url: string;
    title: string;
    description?: string;
    content?: string;
    author?: string;
    source_name?: string;
    image_url?: string;
    published_at?: string | Date;
    liked_at?: string | Date;
}
