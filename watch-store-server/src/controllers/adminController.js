const getDashboardStats = async (req, res) => {
  res.json({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    bestSellingProducts: [],
  });
};

const getCustomers = async (req, res) => {
  res.json([]);
};

const getCustomerById = async (req, res) => {
  res.json({});
};

const toggleCustomerStatus = async (req, res) => {
  res.json({ message: "Toggle customer status" });
};

module.exports = {
  getDashboardStats,
  getCustomers,
  getCustomerById,
  toggleCustomerStatus,
};
