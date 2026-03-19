import express from "express";

import dotenv from "dotenv";

import connect from "./config/db.js";

import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();


app.use(express.json());

app.use("/api", userRoutes);

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

app.listen(Port, () => {
  console.log(`server is running on ${Port}`);
});
