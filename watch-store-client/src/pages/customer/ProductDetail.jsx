import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SEO from "../../components/common/SEO";
import { getProductByIdApi } from "../../api/productApi";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await getProductByIdApi(id);
        const data = res?.data?.data ?? res?.data;
        if (data?.status === "Ẩn") {
          setProduct(null);
          return;
        }
        setProduct(data);
      } catch (error) {
        console.error("Get product detail failed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!product) return;
    addToCart(product, Number(quantity));
    setMessage("Đã thêm vào giỏ hàng");
  };

  if (loading) {
    return (
      <div className="container page-section">
        <p>Đang tải chi tiết sản phẩm...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container page-section">
        <p>Không tìm thấy sản phẩm.</p>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={product.name}
        description={product.description || "Chi tiết sản phẩm đồng hồ."}
      />

      <section className="product-detail-page">
        <div className="container">
          <div className="product-detail-shop">
            <div className="product-detail-left">
              <div className="product-detail-main-image">
                <img src={product.image} alt={product.name} />
              </div>
            </div>

            <div className="product-detail-right">
              <p className="detail-brand">{product.brand || "WatchStore"}</p>
              <h1 className="detail-title">{product.name}</h1>
              <p className="detail-price">
                {Number(product.price).toLocaleString("vi-VN")} đ
              </p>

              <div className="detail-meta">
                <p>
                  <strong>Danh mục:</strong> {product.category || "N/A"}
                </p>
                <p>
                  <strong>Tồn kho:</strong> {product.stock}
                </p>
              </div>

              <div className="detail-description-box">
                <h3>Mô tả sản phẩm</h3>
                <p>
                  {product.description || "Chưa có mô tả cho sản phẩm này."}
                </p>
              </div>

              <div className="detail-buy-box">
                <div className="quantity-box">
                  <label>Số lượng</label>
                  <input
                    type="number"
                    min="1"
                    max={product.stock || 99}
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </div>

                <button
                  onClick={handleAddToCart}
                  className="add-cart-btn large-btn"
                >
                  Thêm vào giỏ hàng
                </button>
              </div>

              {message && <p className="success-text">{message}</p>}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default ProductDetail;
