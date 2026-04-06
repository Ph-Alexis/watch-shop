const express = require("express");
const router = express.Router();

const {
  getDashboardStats,
  getCustomers,
  getCustomerById,
  toggleCustomerStatus,
} = require("../controllers/adminController");

const protect = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/adminMiddleware");

router.get("/dashboard", protect, isAdmin, getDashboardStats);
router.get("/customers", protect, isAdmin, getCustomers);
router.get("/customers/:id", protect, isAdmin, getCustomerById);
router.patch(
  "/customers/:id/toggle-status",
  protect,
  isAdmin,
  toggleCustomerStatus,
);

module.exports = router;
