import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getProductsApi } from "../../api/productApi";
import { getCategoriesApi } from "../../api/categoryApi";
import { getAllOrdersApi } from "../../api/orderApi";
import axiosClient from "../../utils/axiosClient";
import { useAuth } from "../../context/AuthContext";

const MAX_RECENT_ROWS = 5;

const getArrayPayload = (response) => {
  const payload = response?.data?.data ?? response?.data;
  return Array.isArray(payload) ? payload : [];
};

const getSafeDate = (value) => {
  const time = new Date(value).getTime();
  return Number.isNaN(time) ? 0 : time;
};

const sortByNewest = (list) =>
  [...list].sort((a, b) => getSafeDate(b?.createdAt) - getSafeDate(a?.createdAt));

const ORDER_STATUS_META = {
  pending: { label: "Chờ xác nhận", tone: "warning" },
  confirmed: { label: "Đã xác nhận", tone: "success" },
  shipping: { label: "Đang giao", tone: "info" },
  delivered: { label: "Đã giao", tone: "success" },
  cancelled: { label: "Đã hủy", tone: "danger" },
};

function AdminDashboardPage() {
  const { isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        const [productsRes, categoriesRes, usersRes, ordersRes] = await Promise.all([
          getProductsApi(),
          getCategoriesApi(),
          axiosClient.get("/users"),
          getAllOrdersApi(),
        ]);

        setProducts(getArrayPayload(productsRes));
        setCategories(getArrayPayload(categoriesRes));
        setUsers(getArrayPayload(usersRes));
        setOrders(getArrayPayload(ordersRes));
      } catch (err) {
        console.error("Fetch dashboard data failed:", err);
        setError("Không thể tải dữ liệu dashboard. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const orderStatusStats = useMemo(() => {
    return orders.reduce(
      (acc, order) => {
        const status = String(order?.orderStatus || "").toLowerCase();
        if (status === "pending") acc.pending += 1;
        if (status === "confirmed") acc.confirmed += 1;
        if (status === "shipping") acc.shipping += 1;
        if (status === "delivered") acc.delivered += 1;
        if (status === "cancelled") acc.cancelled += 1;
        return acc;
      },
      { pending: 0, confirmed: 0, shipping: 0, delivered: 0, cancelled: 0 },
    );
  }, [orders]);

  const recentProducts = useMemo(
    () => sortByNewest(products).slice(0, MAX_RECENT_ROWS),
    [products],
  );
  const recentOrders = useMemo(
    () => sortByNewest(orders).slice(0, MAX_RECENT_ROWS),
    [orders],
  );
  const recentUsers = useMemo(
    () => sortByNewest(users).slice(0, MAX_RECENT_ROWS),
    [users],
  );

  const statsCards = [
    { label: "Tổng số sản phẩm", value: products.length, link: "/admin/products" },
    { label: "Tổng số danh mục", value: categories.length, link: "/admin/settings" },
    { label: "Tổng số tài khoản", value: users.length, link: "/admin/customers" },
    { label: "Tổng số đơn hàng", value: orders.length, link: "/admin/orders" },
    {
      label: "Chờ xác nhận",
      value: orderStatusStats.pending,
      link: "/admin/orders",
      tone: "warning",
    },
    {
      label: "Đã xác nhận",
      value: orderStatusStats.confirmed,
      link: "/admin/orders",
      tone: "success",
    },
    {
      label: "Đang giao",
      value: orderStatusStats.shipping,
      link: "/admin/orders",
      tone: "info",
    },
    {
      label: "Đã giao",
      value: orderStatusStats.delivered,
      link: "/admin/orders",
      tone: "success",
    },
    {
      label: "Đã hủy",
      value: orderStatusStats.cancelled,
      link: "/admin/orders",
      tone: "danger",
    },
  ];

  const styles = {
    container: {
      minHeight: "100vh",
      padding: "24px",
      backgroundColor: "#f4f6f8",
    },
    header: {
      marginBottom: "18px",
    },
    title: {
      margin: 0,
      fontSize: "28px",
      color: "#182230",
    },
    subtitle: {
      margin: "6px 0 0",
      color: "#667085",
    },
    notice: {
      marginTop: "14px",
      padding: "10px 12px",
      borderRadius: "8px",
      backgroundColor: "#fef3f2",
      border: "1px solid #fecdca",
      color: "#b42318",
      fontWeight: 600,
    },
    statsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
      gap: "12px",
      marginBottom: "18px",
    },
    card: {
      display: "block",
      padding: "16px",
      borderRadius: "12px",
      backgroundColor: "#ffffff",
      boxShadow: "0 6px 22px rgba(16, 24, 40, 0.08)",
      border: "1px solid #edf2f7",
      textDecoration: "none",
    },
    cardLabel: {
      margin: 0,
      color: "#667085",
      fontSize: "13px",
      fontWeight: 600,
    },
    cardValue: {
      margin: "8px 0 0",
      color: "#101828",
      fontSize: "32px",
      fontWeight: 700,
      lineHeight: 1,
    },
    cardWarning: {
      border: "1px solid #fef0c7",
      backgroundColor: "#fffbeb",
    },
    cardSuccess: {
      border: "1px solid #d1fadf",
      backgroundColor: "#f6fef9",
    },
    cardInfo: {
      border: "1px solid #d1e9ff",
      backgroundColor: "#f5f8ff",
    },
    cardDanger: {
      border: "1px solid #fecdca",
      backgroundColor: "#fef3f2",
    },
    tableGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
      gap: "14px",
    },
    tableCard: {
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      boxShadow: "0 6px 22px rgba(16, 24, 40, 0.08)",
      overflow: "hidden",
      border: "1px solid #edf2f7",
    },
    tableHead: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "14px 16px",
      borderBottom: "1px solid #eaecf0",
      backgroundColor: "#f9fafb",
    },
    tableTitle: {
      margin: 0,
      fontSize: "16px",
      color: "#101828",
    },
    tableLink: {
      color: "#175cd3",
      fontWeight: 600,
      fontSize: "13px",
      textDecoration: "none",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
    },
    th: {
      textAlign: "left",
      padding: "10px 14px",
      fontSize: "12px",
      color: "#667085",
      borderBottom: "1px solid #f2f4f7",
    },
    td: {
      padding: "12px 14px",
      borderBottom: "1px solid #f2f4f7",
      color: "#344054",
      fontSize: "14px",
    },
    strongTd: {
      padding: "12px 14px",
      borderBottom: "1px solid #f2f4f7",
      color: "#101828",
      fontSize: "14px",
      fontWeight: 600,
    },
    emptyRow: {
      textAlign: "center",
      padding: "22px",
      color: "#98a2b3",
    },
    mono: {
      fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
      fontSize: "12px",
      color: "#667085",
    },
    badge: (status) => {
      if (status === "shipping") {
        return {
          display: "inline-block",
          padding: "4px 10px",
          borderRadius: "999px",
          backgroundColor: "#d1e9ff",
          color: "#175cd3",
          fontSize: "12px",
          fontWeight: 700,
        };
      }
      if (status === "delivered") {
        return {
          display: "inline-block",
          padding: "4px 10px",
          borderRadius: "999px",
          backgroundColor: "#dcfae6",
          color: "#067647",
          fontSize: "12px",
          fontWeight: 700,
        };
      }
      if (status === "confirmed") {
        return {
          display: "inline-block",
          padding: "4px 10px",
          borderRadius: "999px",
          backgroundColor: "#ecfdf3",
          color: "#067647",
          fontSize: "12px",
          fontWeight: 700,
        };
      }
      if (status === "cancelled") {
        return {
          display: "inline-block",
          padding: "4px 10px",
          borderRadius: "999px",
          backgroundColor: "#fef3f2",
          color: "#b42318",
          fontSize: "12px",
          fontWeight: 700,
        };
      }
      return {
        display: "inline-block",
        padding: "4px 10px",
        borderRadius: "999px",
        backgroundColor: "#fffaeb",
        color: "#b54708",
        fontSize: "12px",
        fontWeight: 700,
      };
    },
  };

  if (!isAdmin) {
    return (
      <div style={styles.container}>
        <div style={styles.notice}>Bạn không có quyền truy cập khu vực quản trị.</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Tổng quan hệ thống</h2>
        <p style={styles.subtitle}>LuxuryTime Dashboard / Admin Overview</p>
        {error ? <div style={styles.notice}>{error}</div> : null}
      </div>

      <div style={styles.statsGrid}>
        {statsCards.map((item) => {
          const toneStyle =
            item.tone === "warning"
              ? styles.cardWarning
              : item.tone === "success"
                ? styles.cardSuccess
                : item.tone === "info"
                  ? styles.cardInfo
                : item.tone === "danger"
                  ? styles.cardDanger
                  : null;
          return (
            <Link key={item.label} to={item.link} style={{ ...styles.card, ...toneStyle }}>
              <p style={styles.cardLabel}>{item.label}</p>
              <p style={styles.cardValue}>{item.value}</p>
            </Link>
          );
        })}
      </div>

      <div style={styles.tableGrid}>
        <section style={styles.tableCard}>
          <div style={styles.tableHead}>
            <h3 style={styles.tableTitle}>Sản phẩm mới</h3>
            <Link to="/admin/products" style={styles.tableLink}>
              Xem tất cả
            </Link>
          </div>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Tên sản phẩm</th>
                <th style={styles.th}>Giá</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={2} style={styles.emptyRow}>
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : recentProducts.length === 0 ? (
                <tr>
                  <td colSpan={2} style={styles.emptyRow}>
                    Chưa có sản phẩm.
                  </td>
                </tr>
              ) : (
                recentProducts.map((product) => (
                  <tr key={product._id}>
                    <td style={styles.strongTd}>{product.name || "N/A"}</td>
                    <td style={styles.td}>
                      {Number(product.price || 0).toLocaleString("vi-VN")} đ
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>

        <section style={styles.tableCard}>
          <div style={styles.tableHead}>
            <h3 style={styles.tableTitle}>Đơn hàng mới</h3>
            <Link to="/admin/orders" style={styles.tableLink}>
              Xem tất cả
            </Link>
          </div>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Mã đơn</th>
                <th style={styles.th}>Khách hàng</th>
                <th style={styles.th}>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={3} style={styles.emptyRow}>
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={3} style={styles.emptyRow}>
                    Chưa có đơn hàng.
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => {
                  const status = String(order.orderStatus || "pending").toLowerCase();
                  const shortCode = `#${String(order._id || "").slice(-6)}`;
                  const customerName =
                    order?.shippingInfo?.fullName || order?.user?.fullName || "N/A";
                  const label = ORDER_STATUS_META[status]?.label || status || "N/A";
                  return (
                    <tr key={order._id}>
                      <td style={styles.td}>
                        <div style={styles.strongTd}>{shortCode}</div>
                        <div style={styles.mono}>{order._id}</div>
                      </td>
                      <td style={styles.td}>{customerName}</td>
                      <td style={styles.td}>
                        <span style={styles.badge(status)}>{label}</span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </section>

        <section style={styles.tableCard}>
          <div style={styles.tableHead}>
            <h3 style={styles.tableTitle}>Khách hàng mới</h3>
            <Link to="/admin/customers" style={styles.tableLink}>
              Xem tất cả
            </Link>
          </div>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Tên</th>
                <th style={styles.th}>Email</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={2} style={styles.emptyRow}>
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : recentUsers.length === 0 ? (
                <tr>
                  <td colSpan={2} style={styles.emptyRow}>
                    Chưa có khách hàng.
                  </td>
                </tr>
              ) : (
                recentUsers.map((user) => (
                  <tr key={user._id}>
                    <td style={styles.strongTd}>{user.fullName || "N/A"}</td>
                    <td style={styles.td}>{user.email || "N/A"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}

export default AdminDashboardPage;
