import axiosClient from "../utils/axiosClient";

export const getSettingsApi = () => axiosClient.get("/settings");
export const updateSettingsApi = (data) => axiosClient.put("/settings", data);
