import { Link, Routes, Route, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import AdminProductsPage from "../pages/admin/AdminProductsPage";
import AdminOrdersPage from "../pages/admin/AdminOrdersPage";
import AdminCustomersPage from "../pages/admin/AdminCustomersPage";
import AdminCategoriesPage from "../pages/admin/AdminCategoriesPage";

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
          <Link to="/admin">Dashboard</Link>
          <Link to="/admin/products">Products</Link>
          <Link to="/admin/orders">Orders</Link>
          <Link to="/admin/customers">Customers</Link>
          <Link to="/admin/categories">Categories</Link>
        </nav>

        <div className="admin-box">
          <Routes>
            <Route index element={<AdminDashboardPage />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="customers" element={<AdminCustomersPage />} />
            <Route path="categories" element={<AdminCategoriesPage />} />
          </Routes>
        </div>
      </div>
    </section>
  );
}

export default AdminLayout;
