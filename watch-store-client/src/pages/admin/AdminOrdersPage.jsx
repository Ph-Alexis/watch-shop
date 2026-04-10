import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllOrdersApi } from "../../api/orderApi";

const STATUS_META = {
  pending: { label: "Chờ xác nhận", bg: "#f1c40f", color: "#111" },
  confirmed: { label: "Đã xác nhận", bg: "#9b59b6", color: "#fff" },
  shipping: { label: "Đang giao", bg: "#3498db", color: "#fff" },
  delivered: { label: "Đã giao", bg: "#2ecc71", color: "#fff" },
  cancelled: { label: "Đã hủy", bg: "#e74c3c", color: "#fff" },
};

function AdminOrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await getAllOrdersApi();
        const list = res?.data?.data ?? res?.data ?? [];
        setOrders(Array.isArray(list) ? list : []);
      } catch (err) {
        console.error("Get all orders failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const styles = {
    container: {
      padding: "30px",
      fontFamily: "Arial, sans-serif",
      backgroundColor: "#f8f9fa",
      minHeight: "100vh",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "25px",
    },
    title: { margin: 0, fontSize: "28px", fontWeight: "bold", color: "#1a1a1a" },
    card: {
      backgroundColor: "#fff",
      borderRadius: "12px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
      overflow: "hidden",
    },
    table: { width: "100%", borderCollapse: "collapse" },
    th: {
      backgroundColor: "#f1f3f5",
      padding: "15px",
      borderBottom: "2px solid #dee2e6",
      color: "#495057",
      fontSize: "14px",
      textAlign: "left",
    },
    td: { padding: "15px", borderBottom: "1px solid #eee", verticalAlign: "middle" },
    badge: (status) => {
      const meta = STATUS_META[status] || {
        label: status || "N/A",
        bg: "#95a5a6",
        color: "#fff",
      };
      return {
        display: "inline-block",
        padding: "5px 12px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: "bold",
        backgroundColor: meta.bg,
        color: meta.color,
      };
    },
    btnDetail: {
      border: "1px solid #3498db",
      color: "#3498db",
      background: "none",
      padding: "6px 12px",
      borderRadius: "6px",
      cursor: "pointer",
      fontWeight: "bold",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Quản lý đơn hàng</h2>
          <div style={{ color: "#888", marginTop: "5px" }}>
            LuxuryTime Dashboard / Orders List
          </div>
        </div>
      </div>

      <div style={styles.card}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Mã đơn hàng</th>
              <th style={styles.th}>Tên khách hàng</th>
              <th style={styles.th}>Ngày đặt</th>
              <th style={styles.th}>Tổng tiền</th>
              <th style={styles.th}>Trạng thái</th>
              <th style={{ ...styles.th, textAlign: "right" }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: "40px" }}>
                  Đang kết nối dữ liệu...
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: "40px" }}>
                  Chưa có đơn hàng.
                </td>
              </tr>
            ) : (
              orders.map((o) => (
                <tr key={o._id}>
                  <td style={styles.td}>
                    <div style={{ fontWeight: "bold" }}>
                      #{String(o._id).slice(-6)}
                    </div>
                    <div style={{ fontSize: "11px", color: "#aaa" }}>{o._id}</div>
                  </td>
                  <td style={styles.td}>
                    {o.shippingInfo?.fullName || o.user?.fullName || "N/A"}
                  </td>
                  <td style={styles.td}>
                    {o.createdAt
                      ? new Date(o.createdAt).toLocaleDateString("vi-VN")
                      : "N/A"}
                  </td>
                  <td style={{ ...styles.td, fontWeight: "bold", color: "#e74c3c" }}>
                    {Number(o.totalAmount || 0).toLocaleString("vi-VN")}₫
                  </td>
                  <td style={styles.td}>
                    <span style={styles.badge(o.orderStatus)}>{STATUS_META[o.orderStatus]?.label || o.orderStatus}</span>
                  </td>
                  <td style={{ ...styles.td, textAlign: "right" }}>
                    <button
                      style={styles.btnDetail}
                      onClick={() => navigate(`/admin/orders/${o._id}`)}
                    >
                      Chi tiết
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminOrdersPage;
