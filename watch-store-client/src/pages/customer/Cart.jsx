import { Link } from "react-router-dom";
import SEO from "../../components/common/SEO";
import { useCart } from "../../context/CartContext";

function Cart() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();

  return (
    <>
      <SEO title="Giỏ hàng" description="Xem và cập nhật giỏ hàng của bạn." />

      <section className="cart-page">
        <div className="container">
          <div className="page-header">
            <h1>Giỏ hàng của bạn</h1>
            <p>Kiểm tra sản phẩm trước khi chuyển sang thanh toán</p>
          </div>

          {cartItems.length === 0 ? (
            <div className="empty-cart-box">
              <p>Giỏ hàng đang trống.</p>
              <Link to="/products" className="detail-btn">
                Tiếp tục mua sắm
              </Link>
            </div>
          ) : (
            <div className="cart-layout">
              <div className="cart-list">
                {cartItems.map((item) => (
                  <div className="cart-item" key={item._id}>
                    <div className="cart-item-image-wrap">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="cart-image"
                      />
                    </div>

                    <div className="cart-info">
                      <h3>{item.name}</h3>
                      <p className="cart-brand">{item.brand || "WatchStore"}</p>
                      <p className="cart-price">
                        Giá: {Number(item.price).toLocaleString("vi-VN")} đ
                      </p>

                      <div className="cart-quantity">
                        <label>Số lượng</label>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            updateQuantity(item._id, Number(e.target.value))
                          }
                        />
                      </div>

                      <p className="cart-subtotal">
                        Thành tiền:{" "}
                        {(
                          Number(item.price) * Number(item.quantity)
                        ).toLocaleString("vi-VN")}{" "}
                        đ
                      </p>

                      <button
                        className="remove-btn"
                        onClick={() => removeFromCart(item._id)}
                      >
                        Xóa sản phẩm
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <aside className="cart-summary-box">
                <h2>Tóm tắt đơn hàng</h2>
                <div className="summary-row">
                  <span>Số sản phẩm</span>
                  <span>{cartItems.length}</span>
                </div>
                <div className="summary-row total">
                  <span>Tổng cộng</span>
                  <span>{cartTotal.toLocaleString("vi-VN")} đ</span>
                </div>

                <Link to="/checkout" className="checkout-btn">
                  Đi đến thanh toán
                </Link>
              </aside>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default Cart;
