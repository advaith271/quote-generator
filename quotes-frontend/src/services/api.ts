import { getIDToken } from "./auth";
import { Quote,LikedQuote,Profile } from "../types";

const API_BASE_URL="https://adhu271.pythonanywhere.com";

const getAuthHeaders = async (): Promise<Record<string, string>> => {
    const token=await getIDToken();
    if(!token) throw new Error("Not authenticated");
    return{
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    };
};

export const fetchRandomQuote = async (): Promise<Quote> => {
    const headers=await getAuthHeaders();
    const response=await fetch(`${API_BASE_URL}/api/quotes/random/`,{headers,});
    if(!response.ok) throw new Error("Failed to fetch quote.");
    return response.json();
};

export const likeQuote = async (quoteId: number): Promise<{status: string}> => {
    const headers=await getAuthHeaders();
    const response=await fetch(`${API_BASE_URL}/api/quotes/${quoteId}/like/`,{method:"POST",headers,});
    if(!response.ok) throw new Error("Failed to like quote");
    return response.json();
};

export const fetchLikedQuotes = async (): Promise<LikedQuote[]> => {
    const headers=await getAuthHeaders();
    const response=await fetch(`${API_BASE_URL}/api/quotes/liked/`,{headers,});
    if(!response.ok) throw new Error("Failed to fetch liked quotes.");
    const data=await response.json();
    return data;
};

export const fetchProfile = async (): Promise<Profile> => {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/api/profile/`, { headers });
  if (!response.ok) throw new Error("Failed to fetch profile");
  return response.json();
};


