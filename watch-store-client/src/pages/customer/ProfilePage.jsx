import { useEffect, useState } from "react";
import SEO from "../../components/common/SEO";
import {
  getProfileApi,
  updateProfileApi,
  changePasswordApi,
} from "../../api/userApi";
import { useAuth } from "../../context/AuthContext";

function ProfilePage() {
  const { setUser } = useAuth();

  const [profileForm, setProfileForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(true);
  const [profileMessage, setProfileMessage] = useState("");
  const [profileError, setProfileError] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfileApi();

        setProfileForm({
          fullName: res.data.fullName || "",
          email: res.data.email || "",
          phone: res.data.phone || "",
          address: res.data.address || "",
        });
      } catch (error) {
        setProfileError(
          error.response?.data?.message || "Không thể tải thông tin cá nhân",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleProfileChange = (e) => {
    setProfileForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePasswordChange = (e) => {
    setPasswordForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileMessage("");
    setProfileError("");

    try {
      const res = await updateProfileApi({
        fullName: profileForm.fullName,
        phone: profileForm.phone,
        address: profileForm.address,
      });

      setProfileMessage(res.data.message || "Cập nhật thành công");

      const updatedUser = res.data.user;
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      setProfileError(
        error.response?.data?.message || "Cập nhật thông tin thất bại",
      );
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordMessage("");
    setPasswordError("");

    try {
      const res = await changePasswordApi(passwordForm);

      setPasswordMessage(res.data.message || "Đổi mật khẩu thành công");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      setPasswordError(
        error.response?.data?.message || "Đổi mật khẩu thất bại",
      );
    }
  };

  if (loading) {
    return (
      <div className="container page-section">
        <p>Đang tải thông tin cá nhân...</p>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Thông tin cá nhân"
        description="Xem và cập nhật thông tin tài khoản khách hàng."
      />

      <section className="profile-page">
        <div className="container">
          <div className="page-header">
            <h1>Tài khoản của tôi</h1>
            <p>Quản lý thông tin cá nhân và thay đổi mật khẩu</p>
          </div>

          <div className="profile-layout">
            <div className="profile-card">
              <h2>Thông tin cá nhân</h2>

              <form
                onSubmit={handleUpdateProfile}
                className="auth-form profile-form"
              >
                <div>
                  <label>Họ tên</label>
                  <input
                    type="text"
                    name="fullName"
                    value={profileForm.fullName}
                    onChange={handleProfileChange}
                    required
                  />
                </div>

                <div>
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={profileForm.email}
                    disabled
                  />
                </div>

                <div>
                  <label>Số điện thoại</label>
                  <input
                    type="text"
                    name="phone"
                    value={profileForm.phone}
                    onChange={handleProfileChange}
                  />
                </div>

                <div>
                  <label>Địa chỉ</label>
                  <input
                    type="text"
                    name="address"
                    value={profileForm.address}
                    onChange={handleProfileChange}
                  />
                </div>

                <button type="submit">Cập nhật thông tin</button>
              </form>

              {profileMessage && (
                <p className="success-text">{profileMessage}</p>
              )}
              {profileError && <p className="error-text">{profileError}</p>}
            </div>

            <div className="profile-card">
              <h2>Đổi mật khẩu</h2>

              <form
                onSubmit={handleChangePassword}
                className="auth-form profile-form"
              >
                <div>
                  <label>Mật khẩu hiện tại</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>

                <div>
                  <label>Mật khẩu mới</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>

                <div>
                  <label>Xác nhận mật khẩu mới</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>

                <button type="submit">Đổi mật khẩu</button>
              </form>

              {passwordMessage && (
                <p className="success-text">{passwordMessage}</p>
              )}
              {passwordError && <p className="error-text">{passwordError}</p>}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default ProfilePage;
