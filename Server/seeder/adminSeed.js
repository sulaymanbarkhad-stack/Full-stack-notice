import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

import User from "../models/user.js";

dotenv.config();

const seedAdmin = async () => {
  const mongoUri = process.env.MONGO_URI;
  const adminName = process.env.ADMIN_NAME || "Super Admin";
  const adminEmail = process.env.ADMIN_EMAIL || "admin@notice.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin@hsdbdbdhjsj";

  if (!mongoUri) {
    console.error("MONGO_URI is missing in .env");
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri);

    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      existingAdmin.name = adminName;
      existingAdmin.password = hashedPassword;
      existingAdmin.role = "admin";
      await existingAdmin.save();
      console.log(`Admin updated: ${adminEmail}`);
    } else {
      await User.create({
        name: adminName,
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
      });
      console.log(`Admin created: ${adminEmail}`);
    }

    console.log("Admin seed completed.");
  } catch (error) {
    console.error("Admin seed failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

seedAdmin();
