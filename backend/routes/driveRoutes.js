import { Router } from "express";
import { uploadFile, listFiles, updateFile, deleteFile, getSingleFile } from "../controllers/driveController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
const router = Router();

router.post("/upload", authMiddleware, uploadFile);
router.get("/files", authMiddleware, listFiles);
router.get("/file/:fileId", authMiddleware, getSingleFile);
router.put("/edit/:fileId", authMiddleware, updateFile);
router.delete("/delete/:fileId", authMiddleware, deleteFile);

export default router;
