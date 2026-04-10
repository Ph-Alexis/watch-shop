import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteProductApi, getProductsApi } from "../../api/productApi";

function AdminProductsPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  // Lấy danh sách sản phẩm
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await getProductsApi();
      const list = res?.data?.data ?? res?.data ?? [];
      setProducts(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error("Lỗi:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa chiếc đồng hồ này không?")) return;

    try {
      await deleteProductApi(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      alert("Đã xóa sản phẩm thành công!");
    } catch (err) {
      console.error("Lỗi khi xóa:", err);
      alert("Ối, có lỗi rồi! Không xóa được sản phẩm này Trâm ơi.");
    }
  };

  const filteredProducts = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter(p => (p.name || p.title || "").toLowerCase().includes(q));
  }, [products, query]);

  const styles = {
    container: { padding: '30px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f8f9fa', minHeight: '100vh' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' },
    title: { margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#1a1a1a' },
    btnAdd: { backgroundColor: '#000', color: '#fff', border: 'none', padding: '12px 25px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
    card: { backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', overflow: 'hidden' },
    searchBar: { width: '100%', padding: '12px', marginBottom: '20px', border: '1px solid #ddd', borderRadius: '8px', outline: 'none' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { backgroundColor: '#f1f3f5', padding: '15px', borderBottom: '2px solid #dee2e6', color: '#495057', fontSize: '14px' },
    td: { padding: '15px', borderBottom: '1px solid #eee', verticalAlign: 'middle' },
    badge: (isShown) => ({
      padding: '5px 12px', borderRadius: '20px', fontSize: '12px', color: '#fff', fontWeight: 'bold',
      backgroundColor: isShown ? '#2ecc71' : '#95a5a6'
    }),
btnEdit: { border: '1px solid #3498db', color: '#3498db', background: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', marginRight: '8px' },
    btnDelete: { border: '1px solid #e74c3c', color: '#e74c3c', background: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Quản lý sản phẩm</h2>
          <div style={{ color: '#888', marginTop: '5px' }}>LuxuryTime Dashboard / Products List</div>
        </div>
        <button style={styles.btnAdd} onClick={() => navigate("/admin/products/create")}>
          + Thêm sản phẩm mới
        </button>
      </div>

      <input 
        style={styles.searchBar} 
        placeholder="Tìm kiếm sản phẩm..." 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div style={styles.card}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Ảnh</th>
              <th style={styles.th}>Tên sản phẩm</th>
              <th style={styles.th}>Danh mục</th>
              <th style={styles.th}>Giá</th>
              <th style={styles.th}>Kho</th>
              <th style={styles.th}>Trạng thái</th>
              <th style={{...styles.th, textAlign: 'right'}}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" style={{textAlign: 'center', padding: '40px'}}>Đang kết nối dữ liệu...</td></tr>
            ) : filteredProducts.map((p) => (
              <tr key={p.id || p._id}>
                <td style={styles.td}>
                  <img src={p.image || p.thumbnail} alt="" style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '6px' }} />
                </td>
                <td style={styles.td}>
                  <div style={{fontWeight: 'bold'}}>{p.name || p.title}</div>
                  <div style={{fontSize: '11px', color: '#aaa'}}>ID: #{String(p.id || p._id).slice(-6)}</div>
                </td>
                <td style={styles.td}>{p.category?.name || "Luxury Watch"}</td>
                <td style={{...styles.td, fontWeight: 'bold', color: '#e74c3c'}}>
                  {Number(p.price).toLocaleString()}₫
                </td>
                <td style={styles.td}>{p.stock || 0}</td>
                <td style={styles.td}>
                  <span style={styles.badge(p.status === "Hiện")}>
                    {p.status === "Hiện" ? "Đang Hiện" : "Đang Ẩn"}
                  </span>
                </td>
                <td style={{...styles.td, textAlign: 'right'}}>
                  <button 
                    onClick={() => navigate(`/admin/products/${p.id || p._id}/edit`)} 
                    style={styles.btnEdit}
                  >
                    Sửa
                  </button>
{/* NÚT XÓA ĐÃ ĐƯỢC KÍCH HOẠT */}
                  <button 
                    style={styles.btnDelete} 
                    onClick={() => handleDelete(p._id)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminProductsPage;
