import { Router } from "express";
import { PageController } from "../controllers/pageController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

// Define routes for CRUD operations
router.get("/showcase/pages" , PageController.getAllShowcase); // GET all pages
router.get("/showcase/pages:id", PageController.getByIdShowcasetAll); // GET all pages
// Protected routes (auth required)
router.get("/pages", authMiddleware, PageController.getAll); // GET all pages
router.get("/pages/:id", authMiddleware, PageController.getById); // GET page by ID
router.post("/pages", authMiddleware, PageController.create); // CREATE a new page
router.put("/pages/:id", authMiddleware, PageController.update); // UPDATE a page by ID
router.delete("/pages/:id", authMiddleware, PageController.delete); // DELETE a page by ID

//!
// router.get("/pages", PageController.getAll); // GET all pages
// router.get("/pages/:id", PageController.getById); // GET page by ID
// router.post("/pages", PageController.create); // CREATE a new page
// router.put("/pages/:id", PageController.update); // UPDATE a page by ID
// router.delete("/pages/:id", PageController.delete); // DELETE a page by ID

export default router;
