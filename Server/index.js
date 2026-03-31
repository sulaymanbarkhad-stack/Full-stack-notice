import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import connect from "./config/db.js";

import userRoutes from "./routes/userRoutes.js";
import noticeRoutes from "./routes/noticeRoutes.js";

import helmet from "helmet";
import cors from "cors";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";


dotenv.config();

const app = express();

app.use(express.json());

app.use(helmet());

const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];
if (process.env.CLIENT_URL) allowedOrigins.push(process.env.CLIENT_URL);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this user/IP, please try again after 15 minutes",
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req, res) => {
    // Check if the user is authenticated via Bearer token
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      const token = req.headers.authorization.split(" ")[1];
      try {
        // Synchronously verify token to extract the genuine user ID
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        return decoded._id || decoded.id || ipKeyGenerator(req, res); 
      } catch (error) {
        // Fallback to IP if token is invalid or expired
        return ipKeyGenerator(req, res);
      }
    }
    // Fallback to IP address for users who haven't logged in yet
    return ipKeyGenerator(req, res);
  }
});

app.use(limiter);

app.get("/", (req, res) => res.send("NoticeBoard API is running..."));

// Routes
app.use("/api/auth", userRoutes);
app.use("/api/notices", noticeRoutes);


app.use((err, req, res, next) => {
  console.error("Global Error Handler Catch:", err.message);
  
  // Specific handling for Multer errors or our custom Cloudinary config error
  if (err.message.includes("Cloudinary") || err.name === 'MulterError') {
    return res.status(400).json({ message: err.message });
  }

  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
});

const normalizePort = (value) => {
  const port = Number(String(value).trim());
  return Number.isInteger(port) && port > 0 ? port : 5000;
};

const Port = normalizePort(process.env.PORT);

const startServer = async () => {
  try {
    await connect();
    if (process.env.NODE_ENV !== 'production') {
      app.listen(Port, () => {
        console.log(`Server running on ${Port}`);
      });
    }
  } catch (error) {
    console.error(error);
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }
  }
};

startServer();

export default app;