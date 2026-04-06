import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        {/* CỘT 1 */}
        <div className="footer-col">
          <h2 className="footer-logo">WatchStore</h2>
          <p className="footer-desc">
            Cửa hàng đồng hồ chính hãng với nhiều mẫu mã hiện đại, phù hợp cho
            mọi phong cách.
          </p>
        </div>

        {/* CỘT 2 */}
        <div className="footer-col">
          <h3>Liên kết nhanh</h3>
          <ul>
            <li>
              <Link to="/">Trang chủ</Link>
            </li>
            <li>
              <Link to="/products">Sản phẩm</Link>
            </li>
            <li>
              <Link to="/cart">Giỏ hàng</Link>
            </li>
            <li>
              <Link to="/contact">Liên hệ</Link>
            </li>
          </ul>
        </div>

        {/* CỘT 3 */}
        <div className="footer-col">
          <h3>Liên hệ</h3>
          <ul>
            <li>
              <strong>Email:</strong> support@watchstore.com
            </li>
            <li>
              <strong>Phone:</strong> +84 123 456 789
            </li>
            <li>
              <strong>Address:</strong> TP. Hồ Chí Minh
            </li>
          </ul>
        </div>

        {/* CỘT 4 */}
        <div className="footer-col">
          <h3>Theo dõi</h3>
          <div className="footer-socials">
            <a href="#">Facebook</a>
            <a href="#">Instagram</a>
            <a href="#">TikTok</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} WatchStore. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
