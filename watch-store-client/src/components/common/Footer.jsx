import { Link } from "react-router-dom";
import { useWebsiteSettings } from "../../context/WebsiteSettingsContext";

function Footer() {
  const { settings } = useWebsiteSettings();

  const socialItems = [
    { label: "Facebook", url: settings?.facebookUrl },
    { label: "Instagram", url: settings?.instagramUrl },
    { label: "TikTok", url: settings?.tiktokUrl },
  ];

  return (
    <footer className="footer">
      <div className="container footer-grid">
        {/* CỘT 1 */}
        <div className="footer-col">
          <h2 className="footer-logo">{settings?.siteName || "WatchStore"}</h2>
          <p className="footer-desc">
            {settings?.footerDescription ||
              "Cửa hàng đồng hồ chính hãng với nhiều mẫu mã hiện đại, phù hợp cho mọi phong cách."}
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
              <strong>Email:</strong> {settings?.contactEmail || "support@watchstore.com"}
            </li>
            <li>
              <strong>Phone:</strong> {settings?.contactPhone || "+84 123 456 789"}
            </li>
            <li>
              <strong>Address:</strong> {settings?.contactAddress || "TP. Hồ Chí Minh"}
            </li>
          </ul>
        </div>

        {/* CỘT 4 */}
        <div className="footer-col">
          <h3>Theo dõi</h3>
          <div className="footer-socials">
            {socialItems.map((item) =>
              item.url ? (
                <a key={item.label} href={item.url} target="_blank" rel="noreferrer">
                  {item.label}
                </a>
              ) : (
                <span key={item.label} style={{ color: "#6b7280" }}>
                  {item.label}
                </span>
              ),
            )}
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} {settings?.siteName || "WatchStore"}. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
