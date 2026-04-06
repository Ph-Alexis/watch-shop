import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SEO from "../../components/common/SEO";
import { useAuth } from "../../context/AuthContext";

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [errorText, setErrorText] = useState("");

  const from = location.state?.from?.pathname || "/";

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setErrorText("");

    try {
      const data = await login(formData);
      setMessage("Đăng nhập thành công");

      if (data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate(from === "/login" ? "/" : from);
      }
    } catch (error) {
      setErrorText(error.response?.data?.message || "Đăng nhập thất bại");
    }
  };

  return (
    <>
      <SEO title="Đăng nhập" description="Đăng nhập tài khoản WatchStore." />

      <div className="container page-section">
        <div className="page-header">
          <h1>Đăng nhập</h1>
          <p>Đăng nhập để mua hàng và quản lý tài khoản của bạn</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div>
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Nhập email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Mật khẩu</label>
            <input
              type="password"
              name="password"
              placeholder="Nhập mật khẩu"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit">Đăng nhập</button>

          <p style={{ marginTop: "12px" }}>
            Chưa có tài khoản? <Link to="/register">Đăng ký</Link>
          </p>
        </form>

        {message && <p className="success-text">{message}</p>}
        {errorText && <p className="error-text">{errorText}</p>}
      </div>
    </>
  );
}

export default LoginPage;
