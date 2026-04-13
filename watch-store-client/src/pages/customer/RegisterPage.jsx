import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SEO from "../../components/common/SEO";
import { useAuth } from "../../context/AuthContext";

function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });

  const [message, setMessage] = useState("");
  const [errorText, setErrorText] = useState("");

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
      const res = await register(formData);

      setMessage(res.message || "Đăng ký thành công");

      navigate("/login");
    } catch (error) {
      setErrorText(
        error.response?.data?.message || "Đăng ký thất bại"
      );
    }
  };

  return (
    <>
      <SEO title="Đăng ký" description="Tạo tài khoản khách hàng mới." />

      <div className="container page-section">
        <div className="page-header">
          <h1>Đăng ký tài khoản</h1>
          <p>Tạo tài khoản để mua hàng và theo dõi đơn hàng</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div>
            <label>Họ tên</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Email</label>
            <input
              type="email"
              name="email"
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
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Số điện thoại</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Địa chỉ</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          <button type="submit">Đăng ký</button>

          <p style={{ marginTop: "12px" }}>
            Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
          </p>
        </form>

        {message && <p className="success-text">{message}</p>}
        {errorText && <p className="error-text">{errorText}</p>}
      </div>
    </>
  );
}

export default RegisterPage;