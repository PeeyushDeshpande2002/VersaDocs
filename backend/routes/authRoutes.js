import express from "express";
import { googleAuth, protectedRoute } from "../controllers/authController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();


router.post("/google", googleAuth);
router.get("/protected", authMiddleware, protectedRoute);

export default router;
