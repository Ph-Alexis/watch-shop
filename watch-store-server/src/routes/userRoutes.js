const express = require("express");
const router = express.Router();

const {
  getProfile,
  updateProfile,
  changePassword,
  getAllUsers,
  toggleLock,
} = require("../controllers/userController");

const protect = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/adminMiddleware");

router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.patch("/change-password", protect, changePassword);
router.get("/", protect, isAdmin, getAllUsers);
router.patch("/:id/toggle-lock", protect, isAdmin, toggleLock);

module.exports = router;
