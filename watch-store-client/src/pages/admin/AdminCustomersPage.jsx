import { useEffect, useMemo, useState } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api/customers";

function AdminCustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pendingIds, setPendingIds] = useState({});

  const authConfig = useMemo(() => {
    const token = localStorage.getItem("token");
    return token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : { headers: {} };
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get(API_BASE_URL, authConfig);
      setCustomers(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Failed to fetch customers:", err);
      setError("Khong the tai danh sach khach hang.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleToggleLock = async (customerId) => {
    try {
      setPendingIds((prev) => ({ ...prev, [customerId]: true }));
      const response = await axios.patch(
        `${API_BASE_URL}/${customerId}/toggle-lock`,
        {},
        authConfig,
      );
      const updatedCustomer = response.data;

      setCustomers((prev) =>
        prev.map((customer) =>
          customer._id === customerId
            ? { ...customer, isActive: updatedCustomer.isActive }
            : customer,
        ),
      );
    } catch (err) {
      console.error("Failed to update customer status:", err);
      setError("Cập nhật trạng thái thất bại. Vui lòng thử lại.");
    } finally {
      setPendingIds((prev) => ({ ...prev, [customerId]: false }));
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Quản lý khách hàng</h2>
        <p style={styles.subtitle}>LuxuryTime Dashboard / Customers</p>
      </div>

      <div style={styles.card}>
        {error ? <div style={styles.errorBox}>{error}</div> : null}

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={{ ...styles.th, width: 80 }}>STT</th>
              <th style={styles.th}>Tên</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Trạng thái</th>
              <th style={{ ...styles.th, textAlign: "right" }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} style={styles.emptyCell}>
                  Đang tải danh sách khách hàng...
                </td>
              </tr>
            ) : customers.length === 0 ? (
              <tr>
                <td colSpan={5} style={styles.emptyCell}>
                  Chưa có khách hàng nào.
                </td>
              </tr>
            ) : (
              customers.map((customer, index) => (
                <tr key={customer._id}>
                  <td style={styles.td}>{index + 1}</td>
                  <td style={styles.tdStrong}>{customer.fullName}</td>
                  <td style={styles.td}>{customer.email}</td>
                  <td style={styles.td}>
                    <span
                      style={
                        customer.isActive ? styles.badgeActive : styles.badgeLocked
                      }
                    >
                      {customer.isActive ? "Đang hoạt động" : "Đã khoá"}
                    </span>
                  </td>
                  <td style={{ ...styles.td, textAlign: "right" }}>
                    <button
                      type="button"
                      disabled={Boolean(pendingIds[customer._id])}
                      style={
                        customer.isActive ? styles.lockButton : styles.unlockButton
                      }
                      onClick={() => handleToggleLock(customer._id)}
                    >
                      {pendingIds[customer._id]
                        ? "Đang xử lý..."
                        : customer.isActive
                          ? "Khoá"
                          : "Mở khoá"}
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
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 6px 22px rgba(16, 24, 40, 0.08)",
    overflow: "hidden",
  },
  errorBox: {
    margin: "16px",
    padding: "10px 12px",
    borderRadius: "8px",
    backgroundColor: "#fef3f2",
    border: "1px solid #fecdca",
    color: "#b42318",
    fontWeight: 600,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    textAlign: "left",
    padding: "14px 16px",
    fontSize: "13px",
    color: "#344054",
    backgroundColor: "#f9fafb",
    borderBottom: "1px solid #eaecf0",
  },
  td: {
    padding: "14px 16px",
    borderBottom: "1px solid #f2f4f7",
    color: "#344054",
  },
  tdStrong: {
    padding: "14px 16px",
    borderBottom: "1px solid #f2f4f7",
    color: "#101828",
    fontWeight: 600,
  },
  emptyCell: {
    textAlign: "center",
    padding: "32px",
    color: "#667085",
  },
  badgeActive: {
    display: "inline-block",
    padding: "4px 10px",
    borderRadius: "999px",
    backgroundColor: "#ecfdf3",
    color: "#067647",
    fontSize: "12px",
    fontWeight: 700,
  },
  badgeLocked: {
    display: "inline-block",
    padding: "4px 10px",
    borderRadius: "999px",
    backgroundColor: "#fef3f2",
    color: "#b42318",
    fontSize: "12px",
    fontWeight: 700,
  },
  lockButton: {
    border: "1px solid #fda29b",
    background: "#fff",
    color: "#b42318",
    padding: "8px 12px",
    borderRadius: "8px",
    fontWeight: 600,
    cursor: "pointer",
  },
  unlockButton: {
    border: "1px solid #84caff",
    background: "#fff",
    color: "#175cd3",
    padding: "8px 12px",
    borderRadius: "8px",
    fontWeight: 600,
    cursor: "pointer",
  },
};

export default AdminCustomersPage;
