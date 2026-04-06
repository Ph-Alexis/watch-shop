import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

function Navbar() {
  const { cartCount, clearCart } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    if (clearCart) clearCart();
    navigate("/");
  };

  return (
    <header className="navbar">
      <div className="container nav-content">
        <Link to="/" className="logo">
          WatchStore
        </Link>

        <nav className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/products">Watches</Link>
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
