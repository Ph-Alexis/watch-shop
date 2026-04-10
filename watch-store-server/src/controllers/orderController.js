const Order = require("../models/Order");
const ALLOWED_ORDER_STATUS = [
  "pending",
  "confirmed",
  "shipping",
  "delivered",
  "cancelled",
];

const createOrder = async (req, res) => {
  try {
    const { items, shippingInfo, paymentMethod, totalAmount, paymentStatus } =
      req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    if (
      !shippingInfo ||
      !shippingInfo.fullName ||
      !shippingInfo.phone ||
      !shippingInfo.address
    ) {
      return res.status(400).json({ message: "Missing shipping information" });
    }

    if (paymentMethod && !["COD", "QR"].includes(paymentMethod)) {
      return res.status(400).json({ message: "Invalid payment method" });
    }

    const finalPaymentMethod = paymentMethod || "COD";
    const finalPaymentStatus =
      finalPaymentMethod === "QR" ? paymentStatus || "paid" : "unpaid";

    const order = await Order.create({
      user: req.user.id || req.user._id,
      items,
      shippingInfo,
      paymentMethod: finalPaymentMethod,
      paymentStatus: finalPaymentStatus,
      orderStatus: "pending",
      totalAmount,
    });

    return res.status(201).json({
      message: "Create order successfully",
      order,
    });
  } catch (error) {
    console.error("CREATE ORDER ERROR:", error);
    return res.status(500).json({ message: "Create order failed" });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id || req.user._id }).sort(
      {
        createdAt: -1,
      },
    );
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Get my orders failed" });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "fullName email",
    );
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Get order failed" });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "fullName email")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Get all orders failed" });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;
    if (!orderStatus) {
      return res.status(400).json({ message: "Missing orderStatus" });
    }
    if (!ALLOWED_ORDER_STATUS.includes(orderStatus)) {
      return res.status(400).json({ message: "Invalid orderStatus" });
    }

    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus },
      { new: true },
    );
    if (!updated) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Update order status failed" });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
};
