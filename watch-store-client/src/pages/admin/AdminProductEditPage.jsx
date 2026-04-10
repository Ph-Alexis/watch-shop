import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProductByIdApi, updateProductApi } from "../../api/productApi";

function AdminProductEditPage() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    brand: "",
    category: "",
    stock: "",
    image: "",
    description: "",
    status: "Hiện" // Giá trị mặc định
  });

  // 1. Lấy dữ liệu cũ từ server
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await getProductByIdApi(id);
        const data = res?.data?.data ?? res?.data;
        if (data) {
          setFormData({
            name: data.name || "",
            price: data.price || "",
            brand: data.brand || "",
            category: data.category?.name || data.category || "",
            stock: data.stock || 0,
            image: data.image || "",
            description: data.description || "",
            status: data.status || "Hiện"
          });
        }
      } catch (err) {
        console.error("Lỗi lấy dữ liệu:", err);
        alert("Không tìm thấy sản phẩm này Trâm ơi!");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // 2. Hàm thay đổi dữ liệu (Dùng chung cho input, textarea và select)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 3. Hàm Lưu thay đổi
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Đảm bảo gửi đủ price, category, brand (và các field khác đang có)
      await updateProductApi(id, {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
      });
      alert("Cập nhật sản phẩm thành công!");
      navigate("/admin/products"); // Sửa xong quay về trang danh sách
    } catch (err) {
      console.error("Lỗi lưu:", err);
      alert("Lỗi rồi! Không lưu được thay đổi đâu Trâm.");
    }
  };

  if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Đang tải dữ liệu LuxuryTime...</div>;

  const styles = {
    container: { padding: '40px', maxWidth: '850px', margin: '0 auto', fontFamily: 'Arial, sans-serif', backgroundColor: '#fff', borderRadius: '12px', marginTop: '30px', boxShadow: '0 0 20px rgba(0,0,0,0.05)' },
    title: { fontSize: '26px', fontWeight: 'bold', marginBottom: '25px', color: '#1a1a1a', borderBottom: '2px solid #eee', paddingBottom: '10px' },
    formGroup: { marginBottom: '20px' },
    label: { display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#444' },
    input: { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px', boxSizing: 'border-box' },
    row: { display: 'flex', gap: '20px' },
    btnSubmit: { backgroundColor: '#000', color: '#fff', padding: '14px 30px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', transition: '0.3s' },
    btnCancel: { backgroundColor: '#f1f3f5', color: '#495057', padding: '14px 30px', border: 'none', borderRadius: '8px', cursor: 'pointer', marginRight: '12px', fontWeight: 'bold' }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Chỉnh sửa sản phẩm</h2>
      
      <form onSubmit={handleSubmit}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Tên đồng hồ:</label>
          <input style={styles.input} name="name" value={formData.name} onChange={handleChange} required />
        </div>

        <div style={styles.row}>
          <div style={{ ...styles.formGroup, flex: 1 }}>
            <label style={styles.label}>Giá bán (₫):</label>
            <input style={styles.input} type="number" name="price" value={formData.price} onChange={handleChange} required />
          </div>
          <div style={{ ...styles.formGroup, flex: 1 }}>
            <label style={styles.label}>Số lượng trong kho:</label>
            <input style={styles.input} type="number" name="stock" value={formData.stock} onChange={handleChange} />
          </div>
        </div>

        <div style={styles.row}>
          <div style={{ ...styles.formGroup, flex: 1 }}>
            <label style={styles.label}>Thương hiệu:</label>
            <input
              style={styles.input}
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              placeholder="VD: Rolex, Casio..."
            />
          </div>
          <div style={{ ...styles.formGroup, flex: 1 }}>
            <label style={styles.label}>Danh mục:</label>
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
            style={{...styles.input, cursor: 'pointer', backgroundColor: '#f8f9fa'}} 
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
          <input style={styles.input} name="image" value={formData.image} onChange={handleChange} />
          {formData.image && (
            <div style={{marginTop: '15px'}}>
              <p style={{fontSize: '12px', color: '#888'}}>Xem trước ảnh:</p>
              <img src={formData.image} alt="Preview" style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '10px', border: '1px solid #eee' }} />
            </div>
          )}
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Mô tả sản phẩm:</label>
          <textarea style={{ ...styles.input, height: '120px', lineHeight: '1.5' }} name="description" value={formData.description} onChange={handleChange} />
        </div>

        <div style={{ borderTop: '1px solid #eee', paddingTop: '20px', marginTop: '10px' }}>
          <button type="button" style={styles.btnCancel} onClick={() => navigate("/admin/products")}>
            Hủy bỏ
          </button>
          <button type="submit" style={styles.btnSubmit}>
            Lưu thay đổi
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdminProductEditPage;
