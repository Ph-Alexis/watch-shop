const User = require("../models/User");
const generateToken = require("../utils/generateToken");

const register = async (req, res) => {
  try {
    const { fullName, email, password, phone, address } = req.body;

    console.log("REGISTER BODY:", req.body);

    if (!fullName || !email || !password) {
      return res.status(400).json({
        message: "Vui lòng nhập đầy đủ họ tên, email và mật khẩu",
      });
    }

    const existed = await User.findOne({ email });
    if (existed) {
      return res.status(400).json({
        message: "Email đã tồn tại",
      });
    }

    const user = await User.create({
      fullName,
      email,
      password,
      phone,
      address,
      role: "customer",
    });

    return res.status(201).json({
      message: "Đăng ký thành công",
      token: generateToken(user),
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return res.status(500).json({
      message: error.message || "Register failed",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("LOGIN BODY:", req.body);

    if (!email || !password) {
      return res.status(400).json({
        message: "Vui lòng nhập email và mật khẩu",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Email không tồn tại",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        message: "Tài khoản đã bị khóa",
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Sai mật khẩu",
      });
    }

    return res.json({
      message: "Đăng nhập thành công",
      token: generateToken(user),
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({
      message: error.message || "Login failed",
    });
  }
};

const me = async (req, res) => {
  try {
    return res.json(req.user);
  } catch (error) {
    console.error("ME ERROR:", error);
    return res.status(500).json({
      message: error.message || "Get me failed",
    });
  }
};

module.exports = {
  register,
  login,
  me,
};
