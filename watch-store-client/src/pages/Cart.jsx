import { useContext } from "react";
import { CartContext } from "../context/CartContext";

function Cart() {
  const { cart, removeFromCart, updateQuantity } = useContext(CartContext);

  return (
    <div className="container mt-4">
      {/* wrapper căn giữa */}
      <div className="mx-auto" style={{ maxWidth: "700px" }}>
        <h2 className="mb-4">Shopping Cart</h2>

        {cart.length === 0 && <p>Your cart is empty</p>}

        {cart.map((item) => (
          <div className="card p-3 mb-3" key={item._id}>
            <h5>{item.name}</h5>

            <p>Price: ${item.price}</p>

            <div className="d-flex align-items-center">
              <input
                type="number"
                min="1"
                value={item.quantity}
                className="form-control w-25"
                onChange={(e) =>
                  updateQuantity(item._id, Number(e.target.value))
                }
              />

              <button
                className="btn btn-danger ms-3"
                onClick={() => removeFromCart(item._id)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Cart;
