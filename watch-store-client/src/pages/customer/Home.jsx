import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SEO from "../../components/common/SEO";
import { getProductsApi } from "../../api/productApi";

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getProductsApi();
        setProducts(res.data.slice(0, 4));
      } catch (error) {
        console.error("Get featured products failed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <>
      <SEO
        title="WatchStore - Trang chủ"
        description="Cửa hàng đồng hồ chính hãng với nhiều mẫu nổi bật và hiện đại."
      />

      <section className="hero-section">
        <div className="container hero-grid">
          <div className="hero-content">
            <p className="hero-tag">Premium Watch Collection</p>
            <h1>Khám phá phong cách của bạn với những mẫu đồng hồ nổi bật</h1>
            <p className="hero-desc">
              WatchStore mang đến các mẫu đồng hồ hiện đại, thanh lịch và phù
              hợp cho nhiều phong cách khác nhau.
            </p>

            <div className="hero-actions">
              <Link to="/products" className="hero-btn primary">
                Mua ngay
              </Link>
              <Link to="/contact" className="hero-btn secondary">
                Liên hệ
              </Link>
            </div>
          </div>

          <div className="hero-image-box">
            <img
              src="https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=900&q=80"
              alt="Luxury watch banner"
              className="hero-image"
            />
          </div>
        </div>
      </section>

      <section className="featured-section">
        <div className="container">
          <div className="section-heading">
            <h2>Sản phẩm nổi bật</h2>
            <p>Một số mẫu đồng hồ được quan tâm nhiều tại WatchStore</p>
          </div>

          {loading ? (
            <p className="page-message">Đang tải sản phẩm...</p>
          ) : products.length === 0 ? (
            <p className="page-message">Chưa có sản phẩm nổi bật.</p>
          ) : (
            <div className="product-grid">
              {products.map((product) => (
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

                    <Link to={`/product/${product._id}`} className="detail-btn">
                      Xem chi tiết
                    </Link>
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

export default Home;
