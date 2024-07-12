import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import adsRoutes from "./routes/adsRoutes";
import PayURoutes from "./routes/PayURoutes";
import { errorHandler } from "./middlewares/errorHandler";
import startConsumer from "./rabbitMQ/startConsumer";
import dotenv from "dotenv";
dotenv.config();

const app = express();

const frontEndUrl = process.env.FRONTEND_URL;
const corsOptions = {
  origin: frontEndUrl,
  credentials: true,
};

app.use(cors(corsOptions));
// Handle preflight requests
app.options("*", cors(corsOptions));

app.use(morgan("dev"));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/ads-service/", adsRoutes);
app.use("/api/ads-service/PayU", PayURoutes);

app.use(errorHandler);

startConsumer();

export default app;
