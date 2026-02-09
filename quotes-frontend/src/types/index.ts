export interface Quote{
    id: number;
    text: string;
    author: string;
}

export interface LikedQuote{
    id: number;
    quote: Quote;
    liked_at: string;
}

export interface Profile {
  id: number;
  firebase_uid: string;
  display_name: string;
  email: string;
  first_login: string;
}
