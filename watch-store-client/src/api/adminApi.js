import axiosClient from "../utils/axiosClient";

// API quản lý khách hàng
export const getAllCustomersApi = () => axiosClient.get("/customers");

export const toggleLockCustomerApi = (id) => axiosClient.patch(`/customers/${id}/toggle-lock`);

// API Thống kê Dashboard
export const getDashboardStatsApi = () => axiosClient.get("/admin/stats");
export const getRevenueReportApi = () => axiosClient.get("/admin/revenue-report");
