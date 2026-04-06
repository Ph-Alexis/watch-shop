const Product = require("../models/Product");

const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Get products failed" });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Get product failed" });
  }
};

const createProduct = async (req, res) => {
  res.json({ message: "Create product" });
};

const updateProduct = async (req, res) => {
  res.json({ message: "Update product" });
};

const deleteProduct = async (req, res) => {
  res.json({ message: "Delete product" });
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
