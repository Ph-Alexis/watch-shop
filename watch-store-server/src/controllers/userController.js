const getProfile = async (req, res) => {
  res.json({});
};

const updateProfile = async (req, res) => {
  res.json({ message: "Update profile" });
};

const changePassword = async (req, res) => {
  res.json({ message: "Change password" });
};

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
};
