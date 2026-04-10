const User = require("../models/User");

const getProfile = async (req, res) => {
  res.json({});
};

const updateProfile = async (req, res) => {
  res.json({ message: "Update profile" });
};

const changePassword = async (req, res) => {
  res.json({ message: "Change password" });
};

const getAllUsers = async (req, res, next) => {
  try {
    const customers = await User.find({ role: "customer" })
      .select("-password")
      .sort({ createdAt: -1 });

    return res.json(customers);
  } catch (error) {
    return next(error);
  }
};

const toggleLock = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("isActive role");

    if (!user || user.role !== "customer") {
      return res.status(404).json({ message: "Customer not found" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { isActive: !user.isActive },
      { new: true },
    ).select("-password");

    return res.json(updatedUser);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  getAllUsers,
  toggleLock,
};
