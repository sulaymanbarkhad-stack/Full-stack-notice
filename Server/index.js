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

if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

app.use(express.json());

app.use(helmet());

const allowedOrigins = [
  "http://localhost:5173", 
  "http://localhost:5174", 
  "https://full-stack-notice-fv3e.vercel.app",
  "https://full-stack-notice.vercel.app"
];

if (process.env.CLIENT_URL) {
  // Add CLIENT_URL if it exists and handles potential trailing slash
  const cleanClientUrl = process.env.Client_url.replace(/\/$/, "");
  if (!allowedOrigins.includes(cleanClientUrl)) {
    allowedOrigins.push(cleanClientUrl);
  }
}

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      const isAllowed = allowedOrigins.some(allowedOrigin => {
        return origin === allowedOrigin || origin.startsWith(allowedOrigin);
      });

      if (isAllowed) {
        callback(null, true);
      } else {
        console.error(`Blocked by CORS: ${origin}`);
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

app.get("/", (req, res) => res.send("NoticeBoard API is running... (v2)"));

// Middleware to ensure DB connection before handling requests
app.use(async (req, res, next) => {
  try {
    await connect();
    next();
  } catch (error) {
    console.error("Database connection failure in middleware:", error.message);
    res.status(503).json({ 
      message: "Database connection error. Please try again later.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined 
    });
  }
});

// Routes
app.use("/api/auth", userRoutes);
app.use("/api/notices", noticeRoutes);


app.use((err, req, res, next) => {
  // Deep logging for production debugging
  console.error("--- Global Error Logger ---");
  console.error("Path:", req.path);
  console.error("Method:", req.method);
  console.error("Error Message:", err.message);
  if (err.stack) {
    console.error("Stack Trace:", err.stack);
  }
  console.error("---------------------------");
  
  // Specific handling for Multer errors or our custom Cloudinary config error
  if (err.message.includes("Cloudinary") || err.name === 'MulterError') {
    return res.status(400).json({ message: err.message });
  }

  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ 
    message,
    error: process.env.NODE_ENV === "development" ? err.message : undefined 
  });
});

const normalizePort = (value) => {
  const port = Number(String(value).trim());
  return Number.isInteger(port) && port > 0 ? port : 5000;
};

const Port = normalizePort(process.env.PORT);

const startServer = async () => {
    if (process.env.NODE_ENV !== 'production') {
      try {
        await connect();
        app.listen(Port, () => {
          console.log(`Server running on ${Port}`);
        });
      } catch (error) {
        console.error("Failed to start development server:", error.message);
      }
    }
};

startServer();

export default app;