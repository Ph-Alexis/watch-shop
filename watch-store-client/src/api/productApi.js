import axiosClient from "../utils/axiosClient";

export const getProductsApi = () => axiosClient.get("/products");
export const getProductByIdApi = (id) => axiosClient.get(`/products/${id}`);
export const createProductApi = (data) => axiosClient.post("/products", data);
export const updateProductApi = (id, data) =>
  axiosClient.put(`/products/${id}`, data);
export const deleteProductApi = (id) => axiosClient.delete(`/products/${id}`);
