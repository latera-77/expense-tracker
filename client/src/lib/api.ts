const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export class ApiError extends Error {
    status: number;

    constructor(status: number, message: string) {
        super(message);
        this.status = status;
    }   
}

export const getToken = () => localStorage.getItem('token');
export const setToken = (token: string) => localStorage.setItem('token', token);
export const clearToken = () => localStorage.removeItem('token');

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> { 
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    const token = getToken();
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }
    const res = await fetch(`${API_URL}${path}`, {...options, headers });

    if (res.status === 204){
        return undefined as T;
    }

    const data = await res.json().catch(() => null);

    if (!res.ok) {
        throw new ApiError(res.status, data?.message || "Something went wrong");
    }

    return data as T;
}