import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

// Ensure environment variables are loaded
import dotenv from "dotenv";
dotenv.config();

const isCloudinaryConfigured = 
  process.env.CLOUDINARY_CLOUD_NAME && 
  process.env.CLOUDINARY_API_KEY && 
  process.env.CLOUDINARY_API_SECRET;

let storage;

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: "notices",
      allowed_formats: ["jpg", "png", "jpeg", "webp"],
    },
  });
} else {
  console.warn("Cloudinary is not configured. File uploads will fail with a 400 error.");
  // Fallback to memory storage or simply null; we'll handle the error in the controller/middleware
  storage = multer.memoryStorage(); 
}

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (!isCloudinaryConfigured) {
      return cb(new Error("Cloudinary credentials are missing in .env file"), false);
    }
    cb(null, true);
  }
});

export default upload;
