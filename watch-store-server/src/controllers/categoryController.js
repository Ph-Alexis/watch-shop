const getCategories = async (req, res) => {
  res.json([]);
};

const createCategory = async (req, res) => {
  res.json({ message: "Create category" });
};

const updateCategory = async (req, res) => {
  res.json({ message: "Update category" });
};

const deleteCategory = async (req, res) => {
  res.json({ message: "Delete category" });
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
