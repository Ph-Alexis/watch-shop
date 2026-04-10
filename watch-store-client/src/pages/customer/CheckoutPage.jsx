import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import SEO from "../../components/common/SEO";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { createOrderApi } from "../../api/orderApi";
import { getPaymentSettingApi } from "../../api/paymentSettingApi";

function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [shippingInfo, setShippingInfo] = useState({
    fullName: user?.fullName || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [paymentSetting, setPaymentSetting] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    const fetchPaymentSetting = async () => {
      try {
        const res = await getPaymentSettingApi();
        setPaymentSetting(res.data);
      } catch (error) {
        console.error("Get payment setting failed:", error);
      }
    };

    fetchPaymentSetting();
  }, []);

  const orderItems = useMemo(() => {
    return cartItems.map((item) => ({
      product: item._id,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: item.quantity,
    }));
  }, [cartItems]);

  const qrContent = useMemo(() => {
    if (!paymentSetting) return "";

    return `WATCHSTORE|BANK:${paymentSetting.bankName}|ACCOUNT:${paymentSetting.accountNumber}|NAME:${paymentSetting.accountName}|AMOUNT:${cartTotal}|NOTE:${paymentSetting.transferContent}`;
  }, [paymentSetting, cartTotal]);

  const handleChange = (e) => {
    setShippingInfo((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCreateOrder = async (statusForQR = "paid") => {
    try {
      setLoading(true);

      const res = await createOrderApi({
        items: orderItems,
        shippingInfo,
        paymentMethod,
        paymentStatus: paymentMethod === "QR" ? statusForQR : "unpaid",
        totalAmount: cartTotal,
      });

      clearCart();
      navigate("/order-success", {
        state: { order: res.data.order },
      });
    } catch (error) {
      setErrorText(error.response?.data?.message || "Đặt hàng thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setErrorText("");

    if (cartItems.length === 0) {
      setErrorText("Giỏ hàng đang trống");
      return;
    }

    if (
      !shippingInfo.fullName ||
      !shippingInfo.phone ||
      !shippingInfo.address
    ) {
      setErrorText("Vui lòng nhập đầy đủ thông tin giao hàng");
      return;
    }

    if (paymentMethod === "COD") {
      await handleCreateOrder("unpaid");
      return;
    }

    if (!paymentSetting?.isQrEnabled) {
      setErrorText("Thanh toán QR hiện đang tạm tắt");
      return;
    }

    setShowQR(true);
  };

  const handleConfirmQRPayment = async () => {
    await handleCreateOrder("paid");
  };

  return (
    <>
      <SEO
        title="Thanh toán"
        description="Nhập thông tin giao hàng và thanh toán COD hoặc QR."
      />

      <section className="checkout-page">
        <div className="container">
          <div className="page-header">
            <h1>Thanh toán</h1>
            <p>Nhập thông tin giao hàng và xác nhận đơn hàng của bạn</p>
          </div>

          {cartItems.length === 0 ? (
            <div className="empty-cart-box">
              <p>Giỏ hàng đang trống, không thể thanh toán.</p>
            </div>
          ) : (
            <div className="checkout-layout">
              <div className="checkout-card">
                <h2>Thông tin giao hàng</h2>

                <form
                  onSubmit={handlePlaceOrder}
                  className="auth-form checkout-form"
                >
                  <div>
                    <label>Họ tên người nhận</label>
                    <input
                      type="text"
                      name="fullName"
                      value={shippingInfo.fullName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <label>Số điện thoại</label>
                    <input
                      type="text"
                      name="phone"
                      value={shippingInfo.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <label>Địa chỉ giao hàng</label>
                    <input
                      type="text"
                      name="address"
                      value={shippingInfo.address}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="payment-box">
                    <label>Phương thức thanh toán</label>

                    <label className="payment-method-item">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="COD"
                        checked={paymentMethod === "COD"}
                        onChange={(e) => {
                          setPaymentMethod(e.target.value);
                          setShowQR(false);
                        }}
                      />
                      <span>Thanh toán khi nhận hàng (COD)</span>
                    </label>

                    <label className="payment-method-item">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="QR"
                        checked={paymentMethod === "QR"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <span>Thanh toán bằng mã QR</span>
                    </label>
                  </div>

                  <button type="submit" disabled={loading}>
                    {paymentMethod === "COD"
                      ? loading
                        ? "Đang xử lý..."
                        : "Xác nhận đặt hàng COD"
                      : "Tiếp tục thanh toán QR"}
                  </button>
                </form>

                {errorText && <p className="error-text">{errorText}</p>}

                {showQR && paymentMethod === "QR" && paymentSetting && (
                  <div className="qr-box">
                    <h3>Quét mã QR để thanh toán</h3>

                    <p className="qr-note">
                      Số tiền cần thanh toán:{" "}
                      <strong>{cartTotal.toLocaleString("vi-VN")} đ</strong>
                    </p>

                    <div className="qr-code-wrap">
                      {paymentSetting.qrImage ? (
                        <img
                          src={paymentSetting.qrImage}
                          alt="QR thanh toán"
                          className="qr-static-image"
                        />
                      ) : (
                        <QRCodeCanvas value={qrContent} size={220} />
                      )}
                    </div>

                    <div className="qr-info">
                      <p>
                        <strong>Ngân hàng:</strong> {paymentSetting.bankName}
                      </p>
                      <p>
                        <strong>Số tài khoản:</strong>{" "}
                        {paymentSetting.accountNumber}
                      </p>
                      <p>
                        <strong>Chủ tài khoản:</strong>{" "}
                        {paymentSetting.accountName}
                      </p>
                      <p>
                        <strong>Nội dung:</strong>{" "}
                        {paymentSetting.transferContent}
                      </p>
                    </div>

                    <button
                      type="button"
                      className="checkout-btn"
                      onClick={handleConfirmQRPayment}
                      disabled={loading}
                    >
                      {loading ? "Đang tạo đơn..." : "Tôi đã thanh toán"}
                    </button>
                  </div>
                )}
              </div>

              <aside className="checkout-summary">
                <h2>Thông tin đơn hàng</h2>

                <div className="checkout-items">
                  {cartItems.map((item) => (
                    <div className="checkout-item" key={item._id}>
                      <img src={item.image} alt={item.name} />
                      <div>
                        <h4>{item.name}</h4>
                        <p>Số lượng: {item.quantity}</p>
                        <p>
                          Giá: {Number(item.price).toLocaleString("vi-VN")} đ
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="summary-row">
                  <span>Tổng sản phẩm</span>
                  <span>{cartItems.length}</span>
                </div>

                <div className="summary-row total">
                  <span>Tổng thanh toán</span>
                  <span>{cartTotal.toLocaleString("vi-VN")} đ</span>
                </div>
              </aside>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default CheckoutPage;
