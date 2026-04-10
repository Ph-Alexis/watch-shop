import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProductApi } from "../../api/productApi";

function AdminProductCreatePage() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [imageFileName, setImageFileName] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    brand: "",
    category: "",
    stock: "",
    image: "",
    description: "",
    status: "Hiện",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "image") setImageFileName("");
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Vui lòng chọn file ảnh hợp lệ.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      setFormData((prev) => ({ ...prev, image: result }));
      setImageFileName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await createProductApi({
        ...formData,
        price: Number(formData.price),
        stock: formData.stock === "" ? 0 : Number(formData.stock),
      });
      alert("Tạo sản phẩm thành công!");
      navigate("/admin/products");
    } catch (err) {
      console.error("Lỗi tạo sản phẩm:", err);
      alert("Không tạo được sản phẩm. Vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  };

  const styles = {
    container: {
      padding: "40px",
      maxWidth: "850px",
      margin: "0 auto",
      fontFamily: "Arial, sans-serif",
      backgroundColor: "#fff",
      borderRadius: "12px",
      marginTop: "30px",
      boxShadow: "0 0 20px rgba(0,0,0,0.05)",
    },
    title: {
      fontSize: "26px",
      fontWeight: "bold",
      marginBottom: "25px",
      color: "#1a1a1a",
      borderBottom: "2px solid #eee",
      paddingBottom: "10px",
    },
    formGroup: { marginBottom: "20px" },
    label: {
      display: "block",
      marginBottom: "8px",
      fontWeight: "bold",
      color: "#444",
    },
    input: {
      width: "100%",
      padding: "12px",
      borderRadius: "8px",
      border: "1px solid #ddd",
      fontSize: "15px",
      boxSizing: "border-box",
    },
    row: { display: "flex", gap: "20px" },
    btnSubmit: (disabled) => ({
      backgroundColor: disabled ? "#444" : "#000",
      color: "#fff",
      padding: "14px 30px",
      border: "none",
      borderRadius: "8px",
      cursor: disabled ? "not-allowed" : "pointer",
      fontWeight: "bold",
      transition: "0.3s",
    }),
    btnCancel: {
      backgroundColor: "#f1f3f5",
      color: "#495057",
      padding: "14px 30px",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      marginRight: "12px",
      fontWeight: "bold",
    },
    uploadRow: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      marginTop: "12px",
      flexWrap: "wrap",
    },
    uploadBtn: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#111827",
      color: "#fff",
      borderRadius: "8px",
      padding: "10px 14px",
      cursor: "pointer",
      fontWeight: "bold",
      border: "none",
      fontSize: "14px",
    },
    uploadHint: { fontSize: "12px", color: "#666" },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Thêm mới sản phẩm</h2>

      <form onSubmit={handleSubmit}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Tên đồng hồ:</label>
          <input
            style={styles.input}
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div style={styles.row}>
          <div style={{ ...styles.formGroup, flex: 1 }}>
            <label style={styles.label}>Giá bán (₫):</label>
            <input
              style={styles.input}
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min={0}
            />
          </div>
          <div style={{ ...styles.formGroup, flex: 1 }}>
            <label style={styles.label}>Số lượng trong kho:</label>
            <input
              style={styles.input}
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              min={0}
            />
          </div>
        </div>

        <div style={styles.row}>
          <div style={{ ...styles.formGroup, flex: 1 }}>
            <label style={styles.label}>Thương hiệu (Brand):</label>
            <input
              style={styles.input}
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              placeholder="VD: Rolex, Casio..."
            />
          </div>
          <div style={{ ...styles.formGroup, flex: 1 }}>
            <label style={styles.label}>Danh mục (Category):</label>
            <input
              style={styles.input}
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="VD: Luxury Watch"
            />
          </div>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Trạng thái hiển thị trên Web:</label>
          <select
            style={{ ...styles.input, cursor: "pointer", backgroundColor: "#f8f9fa" }}
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="Hiện">Đang Hiện (Màu xanh)</option>
            <option value="Ẩn">Đang Ẩn (Màu xám)</option>
          </select>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Link hình ảnh:</label>
          <input
            style={styles.input}
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="https://..."
          />
          <div style={styles.uploadRow}>
            <label htmlFor="create-image-upload" style={styles.uploadBtn}>
              Chọn ảnh từ thiết bị
            </label>
            <input
              id="create-image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageFileChange}
              style={{ display: "none" }}
            />
            <span style={styles.uploadHint}>
              {imageFileName || "Hỗ trợ JPG, PNG, WEBP..."}
            </span>
          </div>
          {formData.image ? (
            <div style={{ marginTop: "15px" }}>
              <p style={{ fontSize: "12px", color: "#888" }}>Xem trước ảnh:</p>
              <img
                src={formData.image}
                alt="Preview"
                style={{
                  width: "120px",
                  height: "120px",
                  objectFit: "cover",
                  borderRadius: "10px",
                  border: "1px solid #eee",
                }}
              />
            </div>
          ) : null}
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Mô tả sản phẩm:</label>
          <textarea
            style={{ ...styles.input, height: "120px", lineHeight: "1.5" }}
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div style={{ borderTop: "1px solid #eee", paddingTop: "20px", marginTop: "10px" }}>
          <button
            type="button"
            style={styles.btnCancel}
            onClick={() => navigate("/admin/products")}
            disabled={saving}
          >
            Hủy bỏ
          </button>
          <button type="submit" style={styles.btnSubmit(saving)} disabled={saving}>
            {saving ? "Đang tạo..." : "Tạo sản phẩm"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdminProductCreatePage;

