import Client, { BaseURL, Local } from "./client";

const baseURL: BaseURL = (import.meta.env.VITE_API_BASE_URL as string | undefined) || Local;

export const api = new Client(baseURL);
