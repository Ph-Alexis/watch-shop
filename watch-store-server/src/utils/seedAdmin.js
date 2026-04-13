require("dotenv").config();
const connectDB = require("../config/db");
const User = require("../models/User");

const seedAdmin = async () => {
  try {
    await connectDB();

    const existed = await User.findOne({ email: "admin@gmail.com" });
    if (existed) {
      console.log("Admin already exists");
      process.exit();
    }

    await User.create({
      fullName: "Super Admin",
      email: "admin@gmail.com",
      password: "123456",
      role: "admin",
    });

    console.log("Seed admin success");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedAdmin();
