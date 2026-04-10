import { useEffect, useRef, useState } from "react";
import { getSettingsApi, updateSettingsApi } from "../../api/settingApi";
import { useWebsiteSettings } from "../../context/WebsiteSettingsContext";

const INITIAL_FORM = {
  siteName: "",
  footerDescription: "",
  logoUrl: "",
  contactEmail: "",
  contactPhone: "",
  contactAddress: "",
  facebookUrl: "",
  instagramUrl: "",
  tiktokUrl: "",
};

const getErrorDetail = (error, fallbackText) => {
  const status = error?.response?.status;
  const serverMessage =
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    "";

  if (status) {
    return `${fallbackText} (HTTP ${status})${serverMessage ? `: ${serverMessage}` : ""}`;
  }

  if (serverMessage) {
    return `${fallbackText}: ${serverMessage}`;
  }

  return fallbackText;
};

function AdminSettingsPage() {
  const { settings, refreshSettings } = useWebsiteSettings();
  const [form, setForm] = useState(INITIAL_FORM);
  const [initialForm, setInitialForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [isErrorMessage, setIsErrorMessage] = useState(false);
  const [selectedLogoFile, setSelectedLogoFile] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const res = await getSettingsApi();
        const data = res?.data || {};
        const merged = { ...INITIAL_FORM, ...data };
        setForm(merged);
        setInitialForm(merged);
        setSelectedLogoFile(null);
      } catch (error) {
        console.error("Get settings failed:", error);
        setIsErrorMessage(true);
        setMessage(getErrorDetail(error, "Không thể tải dữ liệu cài đặt"));
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleLogoUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setSelectedLogoFile(file);

    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({ ...prev, logoUrl: String(reader.result || "") }));
    };
    reader.readAsDataURL(file);
  };

  const handleClearLogo = () => {
    setSelectedLogoFile(null);
    setForm((prev) => ({ ...prev, logoUrl: "" }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCancel = () => {
    setForm(initialForm);
    setSelectedLogoFile(null);
    setMessage("Đã khôi phục dữ liệu ban đầu.");
    setIsErrorMessage(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSave = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      setMessage("");
      setIsErrorMessage(false);
      const saveRes = await updateSettingsApi(form);
      const savedData = { ...INITIAL_FORM, ...(saveRes?.data || {}), ...form };
      await refreshSettings();
      setForm(savedData);
      setInitialForm(savedData);
      setSelectedLogoFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setMessage("Lưu cài đặt thành công.");
    } catch (error) {
      console.error("Update settings failed:", error);
      setIsErrorMessage(true);
      setMessage(getErrorDetail(error, "Lưu cài đặt thất bại"));
    } finally {
      setSaving(false);
    }
  };

  const styles = {
    container: {
      minHeight: "100vh",
      padding: "24px",
      backgroundColor: "#f4f6f8",
    },
    header: {
      marginBottom: "18px",
    },
    title: {
      margin: 0,
      fontSize: "28px",
      color: "#182230",
    },
    subtitle: {
      margin: "6px 0 0",
      color: "#667085",
    },
    form: {
      display: "grid",
      gap: "14px",
    },
    card: {
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      boxShadow: "0 6px 22px rgba(16, 24, 40, 0.08)",
      padding: "16px",
      border: "1px solid #edf2f7",
    },
    cardTitle: {
      margin: "0 0 12px",
      color: "#1d2939",
      fontSize: "18px",
    },
    grid2: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
      gap: "10px",
    },
    field: {
      display: "flex",
      flexDirection: "column",
      gap: "6px",
    },
    label: {
      fontSize: "13px",
      color: "#475467",
      fontWeight: 600,
    },
    input: {
      border: "1px solid #d0d5dd",
      borderRadius: "8px",
      padding: "10px 12px",
      outline: "none",
    },
    textarea: {
      border: "1px solid #d0d5dd",
      borderRadius: "8px",
      padding: "10px 12px",
      outline: "none",
      minHeight: "84px",
      resize: "vertical",
      fontFamily: "inherit",
    },
    logoPreviewBox: {
      marginTop: "10px",
      width: "220px",
      height: "72px",
      borderRadius: "10px",
      background: "#f8fafc",
      border: "1px dashed #d0d5dd",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
    },
    logoPreview: {
      maxWidth: "100%",
      maxHeight: "100%",
      objectFit: "contain",
    },
    actionRow: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "10px",
      marginTop: "2px",
    },
    actionButtons: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    saveButton: {
      border: "none",
      borderRadius: "10px",
      backgroundColor: "#175cd3",
      color: "#fff",
      padding: "10px 18px",
      fontWeight: 700,
      cursor: "pointer",
    },
    cancelButton: {
      border: "1px solid #d0d5dd",
      borderRadius: "10px",
      backgroundColor: "#fff",
      color: "#344054",
      padding: "10px 18px",
      fontWeight: 700,
      cursor: "pointer",
    },
    deleteLogoButton: {
      border: "1px solid #fda29b",
      borderRadius: "8px",
      backgroundColor: "#fff",
      color: "#b42318",
      padding: "8px 12px",
      fontWeight: 600,
      cursor: "pointer",
      marginTop: "8px",
      width: "fit-content",
    },
    message: {
      color: isErrorMessage ? "#b42318" : "#175cd3",
      fontWeight: 600,
      margin: 0,
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Cài đặt website</h2>
        <p style={styles.subtitle}>LuxuryTime Dashboard / Website Settings</p>
      </div>

      <form onSubmit={handleSave} style={styles.form}>
        <section style={styles.card}>
          <h3 style={styles.cardTitle}>Thông tin chung</h3>
          <div style={styles.grid2}>
            <div style={styles.field}>
              <label style={styles.label}>Tên website</label>
              <input
                style={styles.input}
                value={form.siteName}
                onChange={handleChange("siteName")}
                placeholder="LuxuryTime"
                disabled={loading}
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Logo URL</label>
              <input
                style={styles.input}
                value={form.logoUrl}
                onChange={handleChange("logoUrl")}
                placeholder="https://..."
                disabled={loading}
              />
            </div>
            <div style={{ ...styles.field, gridColumn: "1 / -1" }}>
              <label style={styles.label}>Mô tả Footer</label>
              <textarea
                style={styles.textarea}
                value={form.footerDescription}
                onChange={handleChange("footerDescription")}
                placeholder="Cửa hàng đồng hồ chính hãng với nhiều mẫu mã hiện đại, phù hợp cho mọi phong cách."
                disabled={loading}
              />
            </div>
          </div>
          <div style={{ ...styles.field, marginTop: "10px" }}>
            <label style={styles.label}>Upload logo</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              disabled={loading}
            />
            {(selectedLogoFile || form.logoUrl) && (
              <button
                type="button"
                onClick={handleClearLogo}
                style={styles.deleteLogoButton}
                disabled={loading}
              >
                Xóa logo
              </button>
            )}
          </div>
          <div style={styles.logoPreviewBox}>
            {form.logoUrl ? (
              <img src={form.logoUrl} alt={settings?.siteName || "Logo"} style={styles.logoPreview} />
            ) : (
              <span style={{ color: "#98a2b3" }}>Chưa có logo</span>
            )}
          </div>
        </section>

        <section style={styles.card}>
          <h3 style={styles.cardTitle}>Thông tin liên hệ</h3>
          <div style={styles.grid2}>
            <div style={styles.field}>
              <label style={styles.label}>Email</label>
              <input
                style={styles.input}
                value={form.contactEmail}
                onChange={handleChange("contactEmail")}
                placeholder="support@luxurytime.vn"
                disabled={loading}
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Số điện thoại</label>
              <input
                style={styles.input}
                value={form.contactPhone}
                onChange={handleChange("contactPhone")}
                placeholder="+84..."
                disabled={loading}
              />
            </div>
            <div style={{ ...styles.field, gridColumn: "1 / -1" }}>
              <label style={styles.label}>Địa chỉ</label>
              <input
                style={styles.input}
                value={form.contactAddress}
                onChange={handleChange("contactAddress")}
                placeholder="TP. Hồ Chí Minh"
                disabled={loading}
              />
            </div>
          </div>
        </section>

        <section style={styles.card}>
          <h3 style={styles.cardTitle}>Mạng xã hội</h3>
          <div style={styles.grid2}>
            <div style={styles.field}>
              <label style={styles.label}>Facebook URL</label>
              <input
                style={styles.input}
                value={form.facebookUrl}
                onChange={handleChange("facebookUrl")}
                placeholder="https://facebook.com/..."
                disabled={loading}
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Instagram URL</label>
              <input
                style={styles.input}
                value={form.instagramUrl}
                onChange={handleChange("instagramUrl")}
                placeholder="https://instagram.com/..."
                disabled={loading}
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>TikTok URL</label>
              <input
                style={styles.input}
                value={form.tiktokUrl}
                onChange={handleChange("tiktokUrl")}
                placeholder="https://tiktok.com/@..."
                disabled={loading}
              />
            </div>
          </div>
        </section>

        <div style={styles.actionRow}>
          <p style={styles.message}>{message}</p>
          <div style={styles.actionButtons}>
            <button
              type="button"
              onClick={handleCancel}
              disabled={loading || saving}
              style={styles.cancelButton}
            >
              Hủy
            </button>
            <button type="submit" disabled={loading || saving} style={styles.saveButton}>
              {saving ? "Đang lưu..." : "Lưu cài đặt"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default AdminSettingsPage;
