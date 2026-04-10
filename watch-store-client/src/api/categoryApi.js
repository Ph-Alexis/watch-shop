import axiosClient from "../utils/axiosClient";

export const getCategoriesApi = (params = {}) =>
  axiosClient.get("/categories", { params });
