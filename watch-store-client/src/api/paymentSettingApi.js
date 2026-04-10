import axiosClient from "../utils/axiosClient";

export const getPaymentSettingApi = () => axiosClient.get("/payment-setting");
