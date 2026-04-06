import axiosClient from "../utils/axiosClient";

export const getProductsApi = () => axiosClient.get("/products");
export const getProductByIdApi = (id) => axiosClient.get(`/products/${id}`);
