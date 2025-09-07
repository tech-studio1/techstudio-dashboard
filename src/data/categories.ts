import axiosInstance from "@/helpers/axiosInstance";
import { Category } from "@/types/category";

export const fetchAllCategories = async () => {
  await new Promise((resolve, reject) => setTimeout(resolve, 500));
  const { data } = await axiosInstance.get("/v1/category/categories");
  return data as Category[];
};
