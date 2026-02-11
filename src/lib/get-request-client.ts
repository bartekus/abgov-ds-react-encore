import Client, { BaseURL } from "./client";

const baseURL: BaseURL = import.meta.env.VITE_API_BASE_URL;

export function Environment(baseURL: string): BaseURL {
    return `${baseURL}`;
}

export const api = new Client(Environment(baseURL));
