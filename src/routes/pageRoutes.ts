// backend/routes/pageRoutes.ts
import { Router } from "express";
import { PageController } from "../controllers/pageController";

const router = Router();

// Define routes for CRUD operations
router.get("/pages", PageController.getAll); // GET all pages
router.get("/pages/:id", PageController.getById); // GET page by ID
router.post("/pages", PageController.create); // CREATE a new page
router.put("/pages/:id", PageController.update); // UPDATE a page by ID
router.delete("/pages/:id", PageController.delete); // DELETE a page by ID

export default router;
