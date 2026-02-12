import Client, { BaseURL, Local } from "./client";

console.log("import.meta.env", import.meta.env);

const baseURL: BaseURL = import.meta.env.DEV ? Local : ((import.meta.env.VITE_API_BASE_URL as string) ?? `${window.location.origin}/api`);

export const api = new Client(baseURL);
