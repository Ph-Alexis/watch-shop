function Contact() {
  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Contact Us</h2>

      <div className="row">
        {/* Contact Info */}
        <div className="col-md-6">
          <h4>WatchStore</h4>
          <p>
            We are committed to bringing you the best watches from top brands.
          </p>

          <p>
            <strong>Email:</strong> support@watchstore.com
          </p>
          <p>
            <strong>Phone:</strong> +84 123 456 789
          </p>
          <p>
            <strong>Address:</strong> Ho Chi Minh City, Vietnam
          </p>
        </div>

        {/* Contact Form */}
        <div className="col-md-6">
          <form>
            <div className="mb-3">
              <label className="form-label">Your Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter name"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter email"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Message</label>
              <textarea className="form-control" rows="4"></textarea>
            </div>

            <button className="btn btn-dark">Send Message</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Contact;
