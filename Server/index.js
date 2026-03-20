import express from "express";

import dotenv from "dotenv";

import connect from "./config/db.js";

import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();


app.use(express.json());

app.use("/api/auth", userRoutes);

const normalizePort = (value) => {
  const cleanedValue = String(value ?? "")
    .trim()
    .replace(/;$/, "");
  const port = Number(cleanedValue);

  if (Number.isInteger(port) && port > 0) {
    return port;
  }

  return 3001;
};

const Port = normalizePort(process.env.PORT);

const startServer = async () => {
  try {
    await connect();
    app.listen(Port, () => {
      console.log(`server is running on ${Port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
