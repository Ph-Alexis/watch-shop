const createOrder = async (req, res) => {
  res.json({ message: "Create order" });
};

const getMyOrders = async (req, res) => {
  res.json([]);
};

const getOrderById = async (req, res) => {
  res.json({});
};

const getAllOrders = async (req, res) => {
  res.json([]);
};

const updateOrderStatus = async (req, res) => {
  res.json({ message: "Update order status" });
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
};
