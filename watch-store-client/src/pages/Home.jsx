import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { CartContext } from "../context/CartContext";
import { Link } from "react-router-dom";

function Home() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/products?page=${page}`)
      .then((res) => {
        setProducts(res.data.products || []);
        setTotalPages(res.data.totalPages || 1);
      })
      .catch((err) => console.error(err));
  }, [page]);

  return (
    <div className="container-fluid mt-4">
      <h2 className="text-center mb-4">Watch Collection</h2>

      <div className="row">
        {Array.isArray(products) &&
          products.map((product) => (
            <div className="col-md-3 col-sm-6 mb-4" key={product._id}>
              <div className="card h-100 shadow-sm">
                <img
                  src={product.image || "https://via.placeholder.com/300"}
                  className="card-img-top"
                  alt={product.name}
                  style={{ height: "220px", objectFit: "cover" }}
                />

                <div className="card-body d-flex flex-column">
                  <h5>{product.name}</h5>

                  <p className="text-muted">{product.brand}</p>

                  <h6 className="text-primary">${product.price}</h6>

                  <div className="mt-auto d-flex gap-2">
                    <Link
                      to={`/product/${product._id}`}
                      className="btn btn-outline-dark"
                    >
                      View
                    </Link>

                    <button
                      className="btn btn-dark"
                      onClick={() => addToCart(product)}
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>

      <nav className="d-flex justify-content-center mt-4">
        <ul className="pagination">
          {[...Array(totalPages)].map((_, index) => (
            <li
              key={index}
              className={`page-item ${page === index + 1 ? "active" : ""}`}
            >
              <button className="page-link" onClick={() => setPage(index + 1)}>
                {index + 1}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export default Home;
