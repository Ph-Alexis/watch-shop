import axiosClient from "../utils/axiosClient";

export const getPaymentSettingApi = () => axiosClient.get("/payment-setting");

export const updatePaymentSettingApi = (payload) =>
  axiosClient.put("/payment-setting", payload);
