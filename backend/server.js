import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import driveRoutes from "./routes/driveRoutes.js";
 dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/drive", driveRoutes);

const PORT = 5000;
connectDB();
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
