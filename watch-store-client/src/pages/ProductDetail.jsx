import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { CartContext } from "../context/CartContext";

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/products/${id}`)
      .then((res) => setProduct(res.data));
  }, [id]);

  if (!product) return <h3>Loading...</h3>;

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-6">
          <img src={product.image} className="img-fluid" alt={product.name} />
        </div>

        <div className="col-md-6">
          <h2>{product.name}</h2>

          <h4 className="text-danger">${product.price}</h4>

          <p>{product.description}</p>

          <p>
            <strong>Brand:</strong> {product.brand}
          </p>

          <p>
            <strong>Stock:</strong> {product.stock}
          </p>

          <button
            className="btn btn-primary"
            onClick={() => addToCart(product)}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
