import { useState } from "react";
import axios from "axios";
import SEO from "../../components/common/SEO";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios.post("http://localhost:3000/api/auth/forgot-password", {
      email,
    });

    setMessage("Đã gửi email, vui lòng check inbox");
  };

  return (
    <>
      <SEO title="Quên mật khẩu" />

      <div className="container page-section">
        <div className="page-header">
          <h1>Quên mật khẩu</h1>
          <p>Nhập email để nhận link đặt lại mật khẩu</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div>
            <label>Email</label>
            <input
              type="email"
              placeholder="Nhập email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button type="submit">Gửi yêu cầu</button>
        </form>

        {message && <p className="success-text">{message}</p>}
      </div>
    </>
  );
}

export default ForgotPassword;
