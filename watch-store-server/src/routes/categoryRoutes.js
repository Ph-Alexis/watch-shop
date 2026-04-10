const express = require("express");
const router = express.Router();

const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  syncCategoriesFromProducts,
} = require("../controllers/categoryController");

const protect = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/adminMiddleware");

router.get("/", getCategories);
router.post("/sync-from-products", protect, isAdmin, syncCategoriesFromProducts);
router.post("/", protect, isAdmin, createCategory);
router.put("/:id", protect, isAdmin, updateCategory);
router.delete("/:id", protect, isAdmin, deleteCategory);

module.exports = router;
