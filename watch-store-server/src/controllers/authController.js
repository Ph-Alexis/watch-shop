const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const crypto = require("crypto");
const sendEmail = require("../config/email");

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

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Email không tồn tại" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetToken = resetToken;
    user.resetTokenExpire = Date.now() + 15 * 60 * 1000;

    await user.save();

    const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    await sendEmail(
      user.email,
      "Reset Password",
      `<h3>Click vào link để reset password:</h3>
       <a href="${resetLink}">${resetLink}</a>`,
    );

    return res.json({ message: "Đã gửi email reset password" });
  } catch (error) {
    console.error("FORGOT ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const bcrypt = require("bcryptjs");

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Token không hợp lệ hoặc hết hạn",
      });
    }

    user.password = newPassword;

    user.resetToken = undefined;
    user.resetTokenExpire = undefined;

    await user.save();

    return res.json({ message: "Đổi mật khẩu thành công" });
  } catch (error) {
    console.error("RESET ERROR:", error);
    return res.status(500).json({ message: "Server error" });
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
  forgotPassword,
  resetPassword
};
