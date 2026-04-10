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
  try {
    const {
      name,
      price,
      brand,
      category,
      stock,
      image,
      description,
      status,
    } = req.body;

    if (!name || price === undefined || price === null || price === "") {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const product = await Product.create({
      name,
      price: Number(price),
      brand: brand || "",
      category: category || "",
      stock: stock === undefined || stock === null || stock === "" ? 0 : Number(stock),
      image: image || "",
      description: description || "",
      status: status || "Hiện",
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: "Create product failed" });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { name, price, brand, image, description, stock, category, status } =
      req.body;

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (name !== undefined) product.name = name;
    if (price !== undefined) product.price = price;
    if (brand !== undefined) product.brand = brand;
    if (image !== undefined) product.image = image;
    if (description !== undefined) product.description = description;
    if (stock !== undefined) product.stock = stock;
    if (category !== undefined) product.category = category;
    if (status !== undefined) product.status = status;

    const updated = await product.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Update product failed" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: "Delete product failed" });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
