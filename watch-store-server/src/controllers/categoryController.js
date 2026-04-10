const Category = require("../models/Category");
const Product = require("../models/Product");

const toSlug = (input = "") =>
  input
    .toString()
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const GENDER_LABEL_MAP = {
  male: "Nam",
  female: "Nữ",
  unisex: "Unisex",
};

const syncFromProducts = async () => {
  const products = await Product.find({}, "brand category");
  const normalizedGenderMap = new Map();
  const normalizedBrandMap = new Map();

  products.forEach((product) => {
    const categoryValue = (product.category || "").trim();
    if (categoryValue) {
      const key = categoryValue.toLowerCase();
      if (!normalizedGenderMap.has(key)) {
        normalizedGenderMap.set(key, categoryValue);
      }
    }

    const brandValue = (product.brand || "").trim();
    if (brandValue) {
      const key = brandValue.toLowerCase();
      if (!normalizedBrandMap.has(key)) {
        normalizedBrandMap.set(key, brandValue);
      }
    }
  });

  const records = [];

  normalizedGenderMap.forEach((rawValue, key) => {
    const slug = toSlug(key);
    if (!slug) return;
    records.push({
      name: GENDER_LABEL_MAP[key] || rawValue,
      slug,
      group: "gender",
      value: rawValue,
    });
  });

  normalizedBrandMap.forEach((rawValue) => {
    const slug = toSlug(rawValue);
    if (!slug) return;
    records.push({
      name: rawValue,
      slug,
      group: "brand",
      value: rawValue,
    });
  });

  const operations = records.map((record) => ({
    updateOne: {
      filter: { slug: record.slug },
      update: { $setOnInsert: record },
      upsert: true,
    },
  }));

  if (operations.length === 0) {
    return { totalCandidates: 0, createdCount: 0 };
  }

  const result = await Category.bulkWrite(operations, { ordered: false });
  return {
    totalCandidates: records.length,
    createdCount: result.upsertedCount || 0,
  };
};

const getCategories = async (req, res) => {
  try {
    if (req.query.autoSync === "true") {
      await syncFromProducts();
    }

    const filter = {};
    if (req.query.group) {
      filter.group = req.query.group;
    }

    const categories = await Category.find(filter).sort({ group: 1, name: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Get categories failed" });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, description, group, value } = req.body;
    const safeName = (name || "").trim();

    if (!safeName) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const safeValue = (value || safeName).trim();
    const slug = toSlug(safeValue);
    if (!slug) {
      return res.status(400).json({ message: "Category slug is invalid" });
    }

    const existing = await Category.findOne({ slug });
    if (existing) {
      return res.status(409).json({ message: "Category already exists" });
    }

    const created = await Category.create({
      name: safeName,
      slug,
      description: (description || "").trim(),
      group: (group || "general").trim(),
      value: safeValue,
    });

    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ message: "Create category failed" });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { name, description, group, value } = req.body;
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    if (name !== undefined) {
      const safeName = name.trim();
      if (!safeName) {
        return res.status(400).json({ message: "Category name is required" });
      }
      category.name = safeName;
    }

    if (description !== undefined) {
      category.description = description.trim();
    }

    if (group !== undefined) {
      category.group = group.trim();
    }

    if (value !== undefined) {
      category.value = value.trim();
    }

    const slugBase = (category.value || category.name || "").trim();
    const nextSlug = toSlug(slugBase);
    if (!nextSlug) {
      return res.status(400).json({ message: "Category slug is invalid" });
    }

    const duplicate = await Category.findOne({
      slug: nextSlug,
      _id: { $ne: category._id },
    });
    if (duplicate) {
      return res.status(409).json({ message: "Category slug already exists" });
    }

    category.slug = nextSlug;
    const updated = await category.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Update category failed" });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const deleted = await Category.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json({ message: "Delete category success" });
  } catch (error) {
    res.status(500).json({ message: "Delete category failed" });
  }
};

const syncCategoriesFromProducts = async (req, res) => {
  try {
    const result = await syncFromProducts();

    res.json({
      message: "Sync categories from products success",
      totalCandidates: result.totalCandidates,
      createdCount: result.createdCount,
    });
  } catch (error) {
    res.status(500).json({ message: "Sync categories from products failed" });
  }
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  syncCategoriesFromProducts,
};
