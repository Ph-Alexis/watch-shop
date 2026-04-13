import { useEffect, useState } from "react";
import { getMyOrdersApi, getOrderByIdApi } from "../../api/orderApi";

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await getMyOrdersApi();
      setOrders(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = async (id) => {
    try {
      const res = await getOrderByIdApi(id);
      setSelectedOrder(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const closeModal = () => setSelectedOrder(null);

  const getStatusClass = (status) => {
    switch (status) {
      case "pending":
        return "status pending";
      case "confirmed":
        return "status confirmed";
      case "shipping":
        return "status shipping";
      case "delivered":
        return "status delivered";
      case "cancelled":
        return "status cancelled";
      default:
        return "status";
    }
  };

  const steps = ["pending", "confirmed", "shipping", "delivered"];

  const isDone = (step, current) =>
    steps.indexOf(step) <= steps.indexOf(current);

  return (
    <div className="orders-container">
      <h2>📦 Đơn hàng của tôi</h2>

      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <table className="orders-table">
          <thead>
            <tr>
              <th>Mã đơn</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id.slice(-6).toUpperCase()}</td>

                <td>{order.totalAmount.toLocaleString("vi-VN")} đ</td>

                <td>
                  <span className={getStatusClass(order.orderStatus)}>
                    {order.orderStatus}
                  </span>
                </td>

                <td>
                  <button
                    className="btn-detail"
                    onClick={() => handleViewDetail(order._id)}
                  >
                    Xem chi tiết
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* MODAL */}
      {selectedOrder && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-header">
              <h3>Chi tiết đơn hàng</h3>
              <button className="btn-close" onClick={closeModal}>
                X
              </button>
            </div>

            <hr />

            <p>
              <b>Mã đơn:</b> {selectedOrder._id}
            </p>
            <p>
              <b>Người nhận:</b> {selectedOrder.shippingInfo.fullName}
            </p>
            <p>
              <b>SĐT:</b> {selectedOrder.shippingInfo.phone}
            </p>
            <p>
              <b>Địa chỉ:</b> {selectedOrder.shippingInfo.address}
            </p>

            <p>
              <b>Thanh toán:</b> {selectedOrder.paymentMethod}
            </p>
            <p>
              <b>Trạng thái:</b> {selectedOrder.paymentStatus}
            </p>

            <p>
              <b>Trạng thái đơn:</b>{" "}
              <span className={getStatusClass(selectedOrder.orderStatus)}>
                {selectedOrder.orderStatus}
              </span>
            </p>

            {/* TRACKING */}
            <h4>📍 Tracking</h4>
            <div className="tracking">
              {steps.map((step) => (
                <div
                  key={step}
                  className={`step ${
                    isDone(step, selectedOrder.orderStatus) ? "done" : ""
                  }`}
                >
                  {step}
                </div>
              ))}
            </div>

            {/* ITEMS */}
            <h4>🛒 Sản phẩm</h4>
            <div className="items">
              {selectedOrder.items.map((item, i) => (
                <div className="item" key={i}>
                  <span>{item.name}</span>
                  <span>x{item.quantity}</span>
                  <span>{item.price.toLocaleString("vi-VN")} đ</span>
                </div>
              ))}
            </div>

            <h3>
              Tổng tiền: {selectedOrder.totalAmount.toLocaleString("vi-VN")} đ
            </h3>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrdersPage;
