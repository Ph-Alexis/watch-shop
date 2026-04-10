import axiosClient from "../utils/axiosClient";

export const getProfileApi = () => axiosClient.get("/users/profile");
export const updateProfileApi = (data) =>
  axiosClient.put("/users/profile", data);
export const changePasswordApi = (data) =>
  axiosClient.patch("/users/change-password", data);
