const express = require("express");
const router = express.Router();

const {
  getPaymentSetting,
  updatePaymentSetting,
} = require("../controllers/paymentSettingController");

const protect = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/adminMiddleware");

router.get("/", getPaymentSetting);
router.put("/", protect, isAdmin, updatePaymentSetting);

module.exports = router;
