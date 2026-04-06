import axiosClient from "../utils/axiosClient";

export const loginApi = (data) => axiosClient.post("/auth/login", data);
export const registerApi = (data) => axiosClient.post("/auth/register", data);
export const meApi = () => axiosClient.get("/auth/me");
