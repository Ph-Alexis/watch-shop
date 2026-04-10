import axiosClient from "../utils/axiosClient";

export const getAllOrdersApi = () => axiosClient.get("/orders/admin/all");
export const getOrderByIdApi = (id) => axiosClient.get(`/orders/${id}`);
export const updateOrderStatusApi = (id, orderStatus) =>
  axiosClient.patch(`/orders/admin/${id}/status`, { orderStatus });

