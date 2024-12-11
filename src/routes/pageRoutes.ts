import { Router } from "express";
import { PageController } from "../controllers/pageController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

// Define routes for CRUD operations
router.get("/pages", PageController.getAll); // GET all pages
router.get("/pages/:id", PageController.getById); // GET page by ID
// Protected routes (auth required)
router.post("/pages", authMiddleware, PageController.create); // CREATE a new page
router.put("/pages/:id", authMiddleware, PageController.update); // UPDATE a page by ID
router.delete("/pages/:id", authMiddleware, PageController.delete); // DELETE a page by ID

export default router;
