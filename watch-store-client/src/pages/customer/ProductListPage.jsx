import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SEO from "../../components/common/SEO";
import { getProductsApi } from "../../api/productApi";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

function ProductListPage() {
  const [products, setProducts] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(true);

  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getProductsApi();
        setProducts(res.data);
      } catch (error) {
        console.error("Get products failed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    if (!user) {
      navigate("/login");
      return;
    }

    addToCart(product, 1);
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(keyword.toLowerCase()),
  );

  return (
    <>
      <SEO
        title="Danh sách sản phẩm"
        description="Xem danh sách đồng hồ, tìm kiếm và lọc sản phẩm."
      />

      <section className="product-page">
        <div className="container">
          <div className="page-header">
            <h1>Danh sách sản phẩm</h1>
            <p>Khám phá các mẫu đồng hồ nổi bật của WatchStore</p>
          </div>

          <div className="product-toolbar">
            <input
              type="text"
              placeholder="Tìm theo tên sản phẩm..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="search-input"
            />
          </div>

          {loading ? (
            <p className="page-message">Đang tải sản phẩm...</p>
          ) : filteredProducts.length === 0 ? (
            <p className="page-message">Không có sản phẩm phù hợp.</p>
          ) : (
            <div className="product-grid">
              {filteredProducts.map((product) => (
                <article className="product-card" key={product._id}>
                  <Link
                    to={`/product/${product._id}`}
                    className="product-image-wrap"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="product-image"
                    />
                  </Link>

                  <div className="product-card-body">
                    <p className="product-brand">{product.brand || "Watch"}</p>
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-category">
                      {product.category || "Uncategorized"}
                    </p>
                    <p className="product-price">
                      {Number(product.price).toLocaleString("vi-VN")} đ
                    </p>

                    <div className="product-card-actions">
                      <Link
                        to={`/product/${product._id}`}
                        className="detail-btn"
                      >
                        Xem chi tiết
                      </Link>

                      <button
                        className="add-cart-btn secondary-btn"
                        onClick={() => handleAddToCart(product)}
                      >
                        Add to cart
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default ProductListPage;
