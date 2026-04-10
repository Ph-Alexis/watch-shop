import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { getCategoriesApi } from "../../api/categoryApi";
import { useWebsiteSettings } from "../../context/WebsiteSettingsContext";

function Navbar() {
  const { cartCount, clearCart } = useCart();
  const { user, logout } = useAuth();
  const { settings } = useWebsiteSettings();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  const handleLogout = () => {
    logout();
    if (clearCart) clearCart();
    navigate("/");
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategoriesApi({ autoSync: true });
        const list = Array.isArray(response?.data) ? response.data : [];
        setCategories(list);
      } catch (error) {
        console.error("Get categories failed:", error);
      }
    };

    fetchCategories();
  }, []);

  const genderCategories = useMemo(
    () => categories.filter((item) => item?.group === "gender"),
    [categories],
  );

  const brandCategories = useMemo(
    () => categories.filter((item) => item?.group === "brand"),
    [categories],
  );

  const buildProductFilterLink = (key, value) =>
    `/products?${key}=${encodeURIComponent(value || "")}`;

  return (
    <header className="navbar">
      <div className="container nav-content">
        <Link to="/" className="logo">
          {settings?.logoUrl ? (
            <img
              src={settings.logoUrl}
              alt={settings?.siteName || "WatchStore"}
              style={{ height: "42px", width: "auto", objectFit: "contain" }}
            />
          ) : (
            settings?.siteName || "WatchStore"
          )}
        </Link>

        <nav className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/products">Watches</Link>
          <div className="mega-nav-item" tabIndex={0}>
            <span className="mega-trigger" aria-haspopup="true">
              Danh mục
            </span>
            <div className="mega-menu">
              <div className="mega-col">
                <p className="mega-title">DÀNH CHO</p>
                {genderCategories.length === 0 ? (
                  <p className="mega-empty">Đang cập nhật</p>
                ) : (
                  genderCategories.map((item) => (
                    <Link
                      key={item._id}
                      to={buildProductFilterLink("category", item.value || item.slug)}
                    >
                      {item.name}
                    </Link>
                  ))
                )}
              </div>
              <div className="mega-col">
                <p className="mega-title">THƯƠNG HIỆU</p>
                {brandCategories.length === 0 ? (
                  <p className="mega-empty">Đang cập nhật</p>
                ) : (
                  brandCategories.map((item) => (
                    <Link
                      key={item._id}
                      to={buildProductFilterLink("brand", item.value || item.name)}
                    >
                      {item.name}
                    </Link>
                  ))
                )}
              </div>
            </div>
          </div>
          <Link to="/contact">Contact</Link>
          {user?.role === "admin" && <Link to="/admin">Admin</Link>}
        </nav>

        <div className="nav-actions">
          {user && (
            <Link to="/cart" className="cart-btn">
              Cart ({cartCount})
            </Link>
          )}

          {!user ? (
            <Link to="/login" className="nav-auth-link">
              Login
            </Link>
          ) : (
            <>
              <Link to="/profile" className="nav-auth-link">
                {user.fullName || "Account"}
              </Link>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
