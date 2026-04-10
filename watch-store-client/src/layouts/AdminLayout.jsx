import { Link, Routes, Route, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import AdminProductsPage from "../pages/admin/AdminProductsPage";
import AdminProductCreatePage from "../pages/admin/AdminProductCreatePage";
import AdminProductEditPage from "../pages/admin/AdminProductEditPage";
import AdminOrdersPage from "../pages/admin/AdminOrdersPage";
import AdminOrderDetailPage from "../pages/admin/AdminOrderDetailPage";
import AdminCustomersPage from "../pages/admin/AdminCustomersPage";
import AdminSettingsPage from "../pages/admin/AdminSettingsPage";

function AdminLayout() {
  const { user, logout } = useAuth();
  const { clearCart } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    if (clearCart) clearCart();
    navigate("/login");
  };

  return (
    <section className="page-section">
      <div className="container">
        <div className="admin-topbar">
          <div>
            <h1>Admin Panel</h1>
            <p>Khu vực quản trị dành riêng cho admin</p>
          </div>

          <div className="admin-topbar-actions">
            <span className="admin-user">{user?.fullName || "Admin"}</span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>

        <nav className="admin-nav">
          <Link to="/admin">Tổng quan</Link>
          <Link to="/admin/products">Sản phẩm</Link>
          <Link to="/admin/orders">Đơn hàng</Link>
          <Link to="/admin/customers">Khách hàng</Link>
          <Link to="/admin/settings">Cài đặt</Link>
        </nav>

        <div className="admin-box">
          <Routes>
            <Route index element={<AdminDashboardPage />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="products/create" element={<AdminProductCreatePage />} />
            <Route path="products/:id/edit" element={<AdminProductEditPage />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="orders/:id" element={<AdminOrderDetailPage />} />
            <Route path="customers" element={<AdminCustomersPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
          </Routes>
        </div>
      </div>
    </section>
  );
}

export default AdminLayout;
