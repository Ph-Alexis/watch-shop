function Footer() {
  return (
    <footer className="bg-dark text-light mt-5 pt-4 pb-3">
      <div className="container">
        <div className="row">
          {/* About */}
          <div className="col-md-4 mb-3">
            <h5>WatchStore</h5>
            <p>
              Premium watches for every style. Discover luxury, sport, and
              casual watches from top brands.
            </p>
          </div>

          {/* Links */}
          <div className="col-md-4 mb-3">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li>
                <a href="/" className="text-light text-decoration-none">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="text-light text-decoration-none">
                  Products
                </a>
              </li>
              <li>
                <a href="#" className="text-light text-decoration-none">
                  Cart
                </a>
              </li>
              <li>
                <a href="#" className="text-light text-decoration-none">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-md-4 mb-3">
            <h5>Contact</h5>
            <p>Email: support@watchstore.com</p>
            <p>Phone: +84 123 456 789</p>
            <p>Address: Ho Chi Minh City</p>
          </div>
        </div>

        <hr className="bg-light" />

        <div className="text-center">
          <p className="mb-0">© 2026 WatchStore. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
