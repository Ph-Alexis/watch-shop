require("dotenv").config();
const connectDB = require("../config/db");
const User = require("../models/User");

const seedUsers = async () => {
  try {
    await connectDB();

    // 👉 ADMIN
    const adminExist = await User.findOne({ email: "admin@gmail.com" });
    if (!adminExist) {
      await User.create({
        fullName: "Super Admin",
        email: "admin@gmail.com",
        password: "123456",
        role: "admin",
      });
      console.log("Admin created");
    }

    // 👉 USER THƯỜNG
    const userExist = await User.findOne({
      email: "pvqphuong2010@gmail.com",
    });

    if (!userExist) {
      await User.create({
        fullName: "User Test",
        email: "pvqphuong2010@gmail.com",
        password: "123456",
        role: "customer",
      });
      console.log("User created");
    }

    console.log("Seed success");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedUsers();
