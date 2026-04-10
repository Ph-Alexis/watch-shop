import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getOrderByIdApi, updateOrderStatusApi } from "../../api/orderApi";

const STATUS_OPTIONS = [
  { value: "pending", label: "Chờ xác nhận" },
  { value: "confirmed", label: "Đã xác nhận" },
  { value: "shipping", label: "Đang giao" },
  { value: "delivered", label: "Đã giao" },
  { value: "cancelled", label: "Đã hủy" },
];

function AdminOrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [order, setOrder] = useState(null);
  const [orderStatus, setOrderStatus] = useState("pending");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await getOrderByIdApi(id);
        const data = res?.data?.data ?? res?.data;
        setOrder(data || null);
        setOrderStatus(data?.orderStatus || "pending");
      } catch (err) {
        console.error("Get order detail failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const customer = useMemo(() => order?.shippingInfo || {}, [order]);
  const items = useMemo(() => (Array.isArray(order?.items) ? order.items : []), [order]);

  const handleUpdate = async () => {
    try {
      setSaving(true);
      await updateOrderStatusApi(id, orderStatus);
      setOrder((prev) => (prev ? { ...prev, orderStatus } : prev));
      alert("Cập nhật trạng thái đơn hàng thành công!");
    } catch (err) {
      console.error("Update order status failed:", err);
      alert("Không cập nhật được trạng thái. Vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancelOrder = async () => {
    setOrderStatus("cancelled");
    try {
      setSaving(true);
      await updateOrderStatusApi(id, "cancelled");
      setOrder((prev) => (prev ? { ...prev, orderStatus: "cancelled" } : prev));
      alert("Đã hủy đơn hàng!");
    } catch (err) {
      console.error("Cancel order failed:", err);
      alert("Không hủy được đơn. Vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  };

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
      marginBottom: "18px",
    },
    title: { margin: 0, fontSize: "28px", fontWeight: "bold", color: "#1a1a1a" },
    subtitle: { color: "#888", marginTop: "5px" },
    card: {
      backgroundColor: "#fff",
      borderRadius: "12px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
      overflow: "hidden",
      padding: "18px",
    },
    sectionTitle: { margin: "0 0 10px 0", fontSize: "16px" },
    grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" },
    field: { background: "#f8f9fa", border: "1px solid #eee", borderRadius: "10px", padding: "12px" },
    fieldLabel: { fontSize: "12px", color: "#666", marginBottom: "4px" },
    fieldValue: { fontWeight: "bold", color: "#111" },
    table: { width: "100%", borderCollapse: "collapse", marginTop: "10px" },
    th: {
      backgroundColor: "#f1f3f5",
      padding: "12px",
      borderBottom: "2px solid #dee2e6",
      color: "#495057",
      fontSize: "13px",
      textAlign: "left",
    },
    td: { padding: "12px", borderBottom: "1px solid #eee", verticalAlign: "middle" },
    img: { width: "52px", height: "52px", objectFit: "cover", borderRadius: "8px", border: "1px solid #eee" },
    actions: { display: "flex", gap: "10px", marginTop: "14px", flexWrap: "wrap" },
    btn: (variant, disabled) => {
      const base = {
        padding: "10px 14px",
        borderRadius: "8px",
        cursor: disabled ? "not-allowed" : "pointer",
        fontWeight: "bold",
        border: "1px solid transparent",
      };
      if (variant === "primary") {
        return { ...base, background: disabled ? "#444" : "#000", color: "#fff" };
      }
      if (variant === "danger") {
        return { ...base, background: disabled ? "#f3b7b7" : "#e74c3c", color: "#fff" };
      }
      return { ...base, background: "#e9ecef", borderColor: "#dee2e6", color: "#111" };
    },
    select: { padding: "10px", borderRadius: "8px", border: "1px solid #ddd", background: "#fff" },
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <p>Đang tải chi tiết đơn hàng...</p>
      </div>
    );
  }

  if (!order?._id) {
    return (
      <div style={styles.container}>
        <p>Không tìm thấy đơn hàng.</p>
        <button style={styles.btn("default", false)} onClick={() => navigate("/admin/orders")}>
          Quay lại
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Chi tiết đơn hàng</h2>
          <div style={styles.subtitle}>LuxuryTime Dashboard / Order Detail</div>
        </div>
        <button style={styles.btn("default", false)} onClick={() => navigate("/admin/orders")}>
          ← Danh sách đơn
        </button>
      </div>

      <div style={styles.card}>
        <h3 style={styles.sectionTitle}>Thông tin giao hàng</h3>
        <div style={styles.grid}>
          <div style={styles.field}>
            <div style={styles.fieldLabel}>Tên khách</div>
            <div style={styles.fieldValue}>{customer.fullName || "N/A"}</div>
          </div>
          <div style={styles.field}>
            <div style={styles.fieldLabel}>Số điện thoại</div>
            <div style={styles.fieldValue}>{customer.phone || "N/A"}</div>
          </div>
          <div style={{ ...styles.field, gridColumn: "1 / -1" }}>
            <div style={styles.fieldLabel}>Địa chỉ giao hàng</div>
            <div style={styles.fieldValue}>{customer.address || "N/A"}</div>
          </div>
        </div>

        <div style={{ marginTop: "16px" }}>
          <h3 style={styles.sectionTitle}>Sản phẩm trong đơn</h3>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Ảnh</th>
                <th style={styles.th}>Tên đồng hồ</th>
                <th style={styles.th}>Số lượng</th>
                <th style={styles.th}>Đơn giá</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center", padding: "20px" }}>
                    Không có sản phẩm trong đơn.
                  </td>
                </tr>
              ) : (
                items.map((it, idx) => (
                  <tr key={`${it.product || it.name || "item"}-${idx}`}>
                    <td style={styles.td}>
                      <img src={it.image} alt={it.name} style={styles.img} />
                    </td>
                    <td style={styles.td}>
                      <div style={{ fontWeight: "bold" }}>{it.name}</div>
                    </td>
                    <td style={styles.td}>{it.quantity}</td>
                    <td style={{ ...styles.td, fontWeight: "bold", color: "#e74c3c" }}>
                      {Number(it.price || 0).toLocaleString("vi-VN")}₫
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: "16px" }}>
          <h3 style={styles.sectionTitle}>Cập nhật trạng thái</h3>
          <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
            <select
              style={styles.select}
              value={orderStatus}
              onChange={(e) => setOrderStatus(e.target.value)}
              disabled={saving}
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            <div style={styles.actions}>
              <button style={styles.btn("primary", saving)} onClick={handleUpdate} disabled={saving}>
                {saving ? "Đang cập nhật..." : "Cập nhật"}
              </button>
              <button style={styles.btn("danger", saving)} onClick={handleCancelOrder} disabled={saving}>
                Hủy đơn
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminOrderDetailPage;

