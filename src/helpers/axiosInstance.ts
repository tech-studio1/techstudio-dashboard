"use server";
import { auth } from "@/services/auth";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.BASE_URL,
});

axiosInstance.interceptors.request.use(async (config) => {
  const session = await auth();
  if (session?.token) {
    config.headers.Authorization = `Bearer ${session.token}`;
  }
  return config;
});

export default axiosInstance;
