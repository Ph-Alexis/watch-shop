import { useParams } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import SEO from "../../components/common/SEO";

function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();

    await axios.post(
      `http://localhost:3000/api/auth/reset-password/${token}`,
      {
        newPassword: password,
      }
    );

    setMessage("Đổi mật khẩu thành công");
  };

  return (
    <>
      <SEO title="Reset mật khẩu" />

      <div className="container page-section">
        <div className="page-header">
          <h1>Đặt lại mật khẩu</h1>
          <p>Nhập mật khẩu mới của bạn</p>
        </div>

        <form onSubmit={handleReset} className="auth-form">
          <div>
            <label>Mật khẩu mới</label>
            <input
              type="password"
              placeholder="Nhập mật khẩu mới"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit">Đổi mật khẩu</button>
        </form>

        {message && <p className="success-text">{message}</p>}
      </div>
    </>
  );
}

export default ResetPassword;