import axios from "axios";

export const api = axios.create({
  baseURL: "https://upload-ai-backend.vercel.app/",
  // baseURL: "http://localhost:3333/",
});
