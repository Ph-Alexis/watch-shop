import { Link, useLocation } from "react-router-dom";
import SEO from "../../components/common/SEO";

function OrderSuccessPage() {
  const location = useLocation();
  const order = location.state?.order;

  return (
    <>
      <SEO
        title="Đặt hàng thành công"
        description="Đơn hàng của bạn đã được tạo thành công."
      />

      <section className="page-section">
        <div className="container">
          <div className="success-order-box">
            <h1>Đặt hàng thành công</h1>
            <p>Cảm ơn bạn đã mua hàng tại WatchStore.</p>

            {order && (
              <div className="success-order-info">
                <p>
                  <strong>Mã đơn hàng:</strong> {order._id}
                </p>
                <p>
                  <strong>Người nhận:</strong> {order.shippingInfo?.fullName}
                </p>
                <p>
                  <strong>Số điện thoại:</strong> {order.shippingInfo?.phone}
                </p>
                <p>
                  <strong>Địa chỉ:</strong> {order.shippingInfo?.address}
                </p>
                <p>
                  <strong>Phương thức thanh toán:</strong> {order.paymentMethod}
                </p>
                <p>
                  <strong>Trạng thái thanh toán:</strong> {order.paymentStatus}
                </p>
                <p>
                  <strong>Tổng tiền:</strong>{" "}
                  {Number(order.totalAmount).toLocaleString("vi-VN")} đ
                </p>
                <p>
                  <strong>Trạng thái đơn:</strong> {order.orderStatus}
                </p>
              </div>
            )}

            <div className="success-order-actions">
              <Link to="/" className="detail-btn">
                Về trang chủ
              </Link>
              <Link to="/orders" className="checkout-btn">
                Xem đơn hàng
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default OrderSuccessPage;
