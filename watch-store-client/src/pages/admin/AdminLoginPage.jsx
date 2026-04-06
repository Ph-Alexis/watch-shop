import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SEO from "../../components/common/SEO";
import { useAuth } from "../../context/AuthContext";

function AdminLoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errorText, setErrorText] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorText("");

    try {
      const data = await login(formData);

      if (data.user.role !== "admin") {
        setErrorText("Tài khoản này không phải admin");
        return;
      }

      navigate("/admin");
    } catch (error) {
      setErrorText(error.response?.data?.message || "Đăng nhập admin thất bại");
    }
  };

  return (
    <>
      <SEO title="Admin Login" description="Đăng nhập quản trị WatchStore." />

      <div className="container page-section">
        <div className="auth-page-wrap">
          <div className="auth-side-text">
            <h1>Admin Login</h1>
            <p>Chỉ tài khoản quản trị mới có thể truy cập khu vực này.</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div>
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="Admin email"
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
                placeholder="Admin password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit">Đăng nhập admin</button>

            {errorText && <p className="error-text">{errorText}</p>}
          </form>
        </div>
      </div>
    </>
  );
}

export default AdminLoginPage;
